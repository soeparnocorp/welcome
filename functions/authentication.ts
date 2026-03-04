// functions/authentication.ts //
export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // ========== 1. REDIRECT OPENAUTH ==========
  if (!url.searchParams.has('code') && !url.searchParams.has('userId')) {
    const authUrl = new URL("https://openauth.soeparnocorp.workers.dev/authorize");
    authUrl.searchParams.set("client_id", "id-readtalk");
    authUrl.searchParams.set("redirect_uri", "https://id-readtalk.pages.dev/");
    authUrl.searchParams.set("response_type", "code");
    return Response.redirect(authUrl.toString(), 302);
  }
  
  // ========== 2. CODE OPENAUTH ==========
  const code = url.searchParams.get('code');
  if (code) {
    // Tukar code dapetin user
    const tokenResp = await env.OPENAUTH.fetch('/token', {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://id-readtalk.pages.dev/',
        client_id: 'id-readtalk'
      })
    });
    const tokens = await tokenResp.json();
    
    const userResp = await env.OPENAUTH.fetch('/userinfo', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` }
    });
    const user = await userResp.json();
    
    // Redirect userId
    return Response.redirect(`/?userId=${user.id}&email=${user.email}`, 302);
  }
  
  // ========== 3. CHECK USER ID & FORM ==========
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  
  if (userId && email) {
    // Cek username di KV
    const username = await env.PAGES_KV.get(`user:${userId}:name`);
    
    if (username) {
      // ACCOUNT
      return Response.redirect(`/account.html?userId=${userId}&username=${username}`, 302);
    } else {
      // NEWBIE → FORM
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Welcome!</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui; padding: 20px; max-width: 400px; margin: 0 auto; }
            input, button { width: 100%; padding: 10px; margin: 5px 0; }
          </style>
        </head>
        <body>
          <h2>Welcome ${email}!</h2>
          <p>Choose your display name:</p>
          <input type="text" id="username" placeholder="Your name" required>
          <button onclick="saveUsername()">Continue</button>
          
          <script>
            async function saveUsername() {
              const username = document.getElementById('username').value;
              if (!username) return;
              
              await fetch('/oauth/save', {
                method: 'POST',
                body: JSON.stringify({ userId: '${userId}', username })
              });
              
              window.location.href = '/account.html?userId=${userId}&username=' + username;
            }
          </script>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }
  }
  
  return Response.redirect('/', 302);
}

// ========== 4. SUB FUNCTION SAVE USERNAME ==========
export async function onRequestPost(context) {
  const { env, request } = context;
  
  if (request.url.includes('/oauth/save')) {
    const { userId, username } = await request.json();
    await env.PAGES_KV.put(`user:${userId}:name`, username);
    return new Response('OK');
  }
  
  return new Response('Not found', { status: 404 });
}
