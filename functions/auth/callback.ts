// functions/auth/callback.ts
export const onRequest = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) {
    return new Response('No code', { status: 400 });
  }
  
  try {
    // Token exchange code...
    const tokenResp = await env.OPENAUTH.fetch('/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://id-readtalk.pages.dev/auth/callback',
        client_id: 'id-readtalk'
      })
    });

    const tokens = await tokenResp.json();
    
    // Simpan session...
    const sessionId = crypto.randomUUID();
    await env.PAGES_KV.put(`session:${sessionId}`, JSON.stringify(tokens), {
      expirationTtl: 86400
    });

    // Return HTML minimalis - popup langsung close
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Success</title>
      </head>
      <body>
        <script>
          // Kirim pesan ke parent
          window.opener.postMessage({ 
            type: 'LOGIN_SUCCESS',
            sessionId: '${sessionId}'
          }, '*');
          
          // LANGSUNG CLOSE, tanpa nampilin apa-apa
          window.close();
        </script>
      </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': `session_id=${sessionId}; Path=/; HttpOnly; Max-Age=86400`
      }
    });

  } catch (error) {
    return new Response(`
      <script>
        window.opener.postMessage({ 
          type: 'LOGIN_ERROR', 
          error: '${error.message}' 
        }, '*');
        window.close();
      </script>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
