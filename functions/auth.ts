// functions/auth.ts
import type { PagesFunction } from '@cloudflare/workers-types'

interface Env {
  OPENAUTH: Fetcher;
  PAGES_DB: D1Database;
  PAGES_KV: KVNamespace;
}

interface UserData {
  id: string;
  email?: string;
  name?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  try {
    // Route berdasarkan method
    switch (request.method) {
      case 'POST':
        return handleLogin(request, env);
      case 'GET':
        return handleCheckAuth(request, env);
      case 'DELETE':
        return handleLogout(request, env);
      default:
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error) {
    console.error('Auth error:', error);
    return jsonResponse({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
};

async function handleLogin(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { agreed?: boolean; timestamp?: string };
    
    // 1. Validasi input
    if (!body.agreed) {
      return jsonResponse({ error: 'Must agree to terms' }, 400);
    }

    // 2. Panggil openauth service buat bikin token
    const authResponse = await env.OPENAUTH.fetch('https://openauth/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agreedAt: body.timestamp,
        userAgent: request.headers.get('User-Agent')
      })
    });

    if (!authResponse.ok) {
      return jsonResponse({ error: 'Auth service error' }, 502);
    }

    const authData = await authResponse.json() as { token: string; user: UserData };

    // 3. Simpan ke D1
    await env.PAGES_DB.prepare(`
      INSERT INTO user_sessions (user_id, token, agreed_at, user_agent)
      VALUES (?, ?, ?, ?)
    `).bind(
      authData.user.id,
      authData.token,
      body.timestamp || new Date().toISOString(),
      request.headers.get('User-Agent')
    ).run();

    // 4. Simpan ke KV buat fast lookup
    await env.PAGES_KV.put(
      `session:${authData.token}`,
      JSON.stringify({
        userId: authData.user.id,
        createdAt: new Date().toISOString()
      }),
      { expirationTtl: 86400 } // 24 jam
    );

    // 5. Return success
    return jsonResponse({
      success: true,
      token: authData.token,
      user: authData.user,
      redirectUrl: '/account.html'
    });

  } catch (error) {
    console.error('Login handler error:', error);
    return jsonResponse({ error: 'Login failed' }, 500);
  }
}

async function handleCheckAuth(request: Request, env: Env): Promise<Response> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ authenticated: false }, 401);
  }

  const token = authHeader.slice(7);
  
  // Cek di KV dulu
  const sessionData = await env.PAGES_KV.get(`session:${token}`);
  
  if (!sessionData) {
    return jsonResponse({ authenticated: false }, 401);
  }

  return jsonResponse({
    authenticated: true,
    session: JSON.parse(sessionData)
  });
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  const authHeader = request.headers.get('Authorization');
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    await env.PAGES_KV.delete(`session:${token}`);
  }

  return jsonResponse({ success: true });
}

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
