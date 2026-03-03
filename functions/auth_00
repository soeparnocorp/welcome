interface Env {
  // Service bindings (dari wrangler.toml yang udah dibenerin)
  OPENAUTH: Fetcher;
  ACCOUNT: Fetcher;
  
  // Database & Storage
  PAGES_DB: D1Database;
  PAGES_KV: KVNamespace;
  PAGES_STORAGE: R2Bucket;
}

interface Context {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil(promise: Promise<unknown>): void;
  next(input?: Request | string, init?: RequestInit): Promise<Response>;
}

// Handler untuk semua method HTTP (GET, POST, dll)
export const onRequest = async (context: Context): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  try {
    // Routing sederhana berdasarkan method & path
    switch (method) {
      case 'GET':
        // GET /auth - cek status auth
        return handleGetAuth(context);
      
      case 'POST':
        // POST /auth - login / validate token
        return handlePostAuth(context);
      
      case 'DELETE':
        // DELETE /auth - logout
        return handleDeleteAuth(context);
      
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    // Error handling yang proper
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handler khusus GET
async function handleGetAuth(context: Context): Promise<Response> {
  const { env, request } = context;
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return new Response(JSON.stringify({ 
      authenticated: false,
      error: 'No authorization header' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Validasi token pake OPENAUTH service
    const validation = await env.OPENAUTH.fetch('https://openauth/validate', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!validation.ok) {
      return new Response(JSON.stringify({ 
        authenticated: false,
        error: 'Invalid token' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userData = await validation.json();
    
    // Log ke KV untuk tracking
    await env.PAGES_KV.put(
      `session:${userData.userId}`,
      JSON.stringify({
        lastAccess: new Date().toISOString(),
        userAgent: request.headers.get('User-Agent')
      })
    );

    return new Response(JSON.stringify({
      authenticated: true,
      user: userData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Validation error:', error);
    return new Response(JSON.stringify({ 
      authenticated: false,
      error: 'Validation failed' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handler khusus POST (login)
async function handlePostAuth(context: Context): Promise<Response> {
  const { env, request } = context;
  
  try {
    const body = await request.json() as { 
      email?: string; 
      password?: string;
      token?: string;
    };

    // Kalo pake token, langsung validasi
    if (body.token) {
      const validation = await env.OPENAUTH.fetch('https://openauth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: body.token })
      });

      if (!validation.ok) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const userData = await validation.json();
      return new Response(JSON.stringify(userData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Kalo pake email/password, login dulu
    if (body.email && body.password) {
      const login = await env.OPENAUTH.fetch('https://openauth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: body.email,
          password: body.password
        })
      });

      if (!login.ok) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const authData = await login.json();
      
      // Simpan session ke D1
      if (authData.userId) {
        await env.PAGES_DB.prepare(`
          INSERT INTO sessions (user_id, token, created_at)
          VALUES (?, ?, ?)
        `).bind(authData.userId, authData.token, new Date().toISOString())
          .run();
      }

      return new Response(JSON.stringify(authData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handler khusus DELETE (logout)
async function handleDeleteAuth(context: Context): Promise<Response> {
  const { env, request } = context;
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No token provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Call openauth untuk logout
    const logout = await env.OPENAUTH.fetch('https://openauth/logout', {
      method: 'POST',
      headers: { 'Authorization': authHeader }
    });

    if (!logout.ok) {
      return new Response(JSON.stringify({ error: 'Logout failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hapus dari KV
    const token = authHeader.replace('Bearer ', '');
    await env.PAGES_KV.delete(`session:${token}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ error: 'Logout failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
