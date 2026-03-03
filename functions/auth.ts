import type { PagesFunction } from '@cloudflare/workers-types'

interface Env {
  OPENAUTH: Fetcher;  // Service binding ke worker openauth
  PAGES_DB: D1Database;
  PAGES_KV: KVNamespace;
}

// Config
const CLIENT_ID = 'id-readtalk';  // Bisa diganti sesuai kebutuhan
const REDIRECT_URI = 'https://id-readtalk.pages.dev/auth/callback';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Routing berdasarkan path
  const path = url.pathname.replace('/auth', '') || '/';
  
  try {
    switch (path) {
      case '/login':
        return handleLogin(request, env);
      case '/callback':
        return handleCallback(request, env);
      case '/logout':
        return handleLogout(request, env);
      case '/me':
        return handleMe(request, env);
      default:
        return jsonResponse({ error: 'Not found' }, 404);
    }
  } catch (error) {
    console.error('Auth error:', error);
    return jsonResponse({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
};

/**
 * 1. Redirect user ke OpenAuth untuk login
 * GET /auth/login
 */
async function handleLogin(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  // Bikin URL authorize ke openauth worker
  const authorizeUrl = new URL('https://openauth.soeparnocorp.workers.dev/authorize');
  
  // Parameter OAuth2
  authorizeUrl.searchParams.set('client_id', CLIENT_ID);
  authorizeUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', 'openid profile email');
  
  // State untuk CSRF protection (simpan di cookie atau KV)
  const state = crypto.randomUUID();
  authorizeUrl.searchParams.set('state', state);
  
  // Simpan state di KV dengan expiration 5 menit
  await env.PAGES_KV.put(`oauth:state:${state}`, 'pending', {
    expirationTtl: 300 // 5 menit
  });
  
  // Set cookie untuk state (optional)
  const headers = new Headers({
    'Location': authorizeUrl.toString()
  });
  
  headers.append('Set-Cookie', `oauth_state=${state}; Path=/; HttpOnly; Max-Age=300; SameSite=Lax`);
  
  return new Response(null, {
    status: 302,
    headers
  });
}

/**
 * 2. Handle callback setelah user login di OpenAuth
 * GET /auth/callback?code=...&state=...
 */
async function handleCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  
  // Validasi state (CSRF protection)
  if (!state) {
    return jsonResponse({ error: 'Missing state parameter' }, 400);
  }
  
  // Cek state dari cookie atau KV
  const storedState = cookies.oauth_state || await env.PAGES_KV.get(`oauth:state:${state}`);
  if (!storedState || storedState !== 'pending') {
    return jsonResponse({ error: 'Invalid state parameter' }, 400);
  }
  
  // Hapus state dari KV
  await env.PAGES_KV.delete(`oauth:state:${state}`);
  
  if (!code) {
    // Mungkin user cancel atau error
    const error = url.searchParams.get('error');
    return jsonResponse({ error: error || 'Authentication failed' }, 400);
  }
  
  try {
    // Tukar code dengan token pake service binding
    const tokenResponse = await env.OPENAUTH.fetch('/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
      }).toString()
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', tokenResponse.status, errorText);
      return jsonResponse({ error: 'Failed to exchange code' }, 502);
    }
    
    const tokens = await tokenResponse.json() as {
      access_token: string;
      refresh_token?: string;
      id_token?: string;
      expires_in?: number;
    };
    
    // Dapatkan user info dari OpenAuth (optional)
    let userInfo = null;
    if (tokens.access_token) {
      const userResponse = await env.OPENAUTH.fetch('/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`
        }
      });
      
      if (userResponse.ok) {
        userInfo = await userResponse.json();
      }
    }
    
    // Simpan session di D1
    const sessionId = crypto.randomUUID();
    const expiresAt = tokens.expires_in 
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // default 24 jam
    
    await env.PAGES_DB.prepare(`
      INSERT INTO sessions (id, user_id, access_token, refresh_token, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      userInfo?.sub || 'unknown',
      tokens.access_token,
      tokens.refresh_token || null,
      expiresAt,
      new Date().toISOString()
    ).run();
    
    // Simpan juga di KV untuk fast lookup
    await env.PAGES_KV.put(
      `session:${sessionId}`,
      JSON.stringify({
        userId: userInfo?.sub,
        accessToken: tokens.access_token,
        expiresAt
      }),
      { expirationTtl: tokens.expires_in || 86400 }
    );
    
    // Set cookie session
    const headers = new Headers({
      'Location': '/account.html', // Redirect ke account page
      'Set-Cookie': `session_id=${sessionId}; Path=/; HttpOnly; Max-Age=${tokens.expires_in || 86400}; SameSite=Lax`
    });
    
    return new Response(null, {
      status: 302,
      headers
    });
    
  } catch (error) {
    console.error('Callback error:', error);
    return jsonResponse({ error: 'Authentication failed' }, 500);
  }
}

/**
 * 3. Logout - hapus session
 * POST /auth/logout
 */
async function handleLogout(request: Request, env: Env): Promise<Response> {
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const sessionId = cookies.session_id;
  
  if (sessionId) {
    // Hapus dari D1
    await env.PAGES_DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    
    // Hapus dari KV
    await env.PAGES_KV.delete(`session:${sessionId}`);
  }
  
  // Hapus cookie
  const headers = new Headers({
    'Location': '/',
    'Set-Cookie': 'session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  });
  
  return new Response(null, {
    status: 302,
    headers
  });
}

/**
 * 4. Dapatkan info user yang sedang login
 * GET /auth/me
 */
async function handleMe(request: Request, env: Env): Promise<Response> {
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const sessionId = cookies.session_id;
  
  if (!sessionId) {
    return jsonResponse({ authenticated: false }, 401);
  }
  
  // Cek session di KV (cepat)
  let sessionData = await env.PAGES_KV.get(`session:${sessionId}`);
  
  if (!sessionData) {
    // Fallback ke D1
    const session = await env.PAGES_DB.prepare(`
      SELECT * FROM sessions WHERE id = ? AND expires_at > ?
    `).bind(sessionId, new Date().toISOString()).first();
    
    if (!session) {
      return jsonResponse({ authenticated: false }, 401);
    }
    
    sessionData = JSON.stringify(session);
  }
  
  const session = JSON.parse(sessionData);
  
  // Dapatkan user info dari OpenAuth pake access token
  if (session.accessToken) {
    const userResponse = await env.OPENAUTH.fetch('/userinfo', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });
    
    if (userResponse.ok) {
      const userInfo = await userResponse.json();
      return jsonResponse({
        authenticated: true,
        user: userInfo,
        sessionId: session.id
      });
    }
  }
  
  return jsonResponse({
    authenticated: true,
    sessionId: session.id
  });
}

// Helper functions
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieString) return cookies;
  
  cookieString.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  
  return cookies;
}
