export const onRequest = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) return Response.redirect('/', 302);
  
  // 1. Tukar code dapetin key id dari OpenAuth
  const tokenResp = await env.OPENAUTH.fetch('/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://id-readtalk.pages.dev/account',
      client_id: 'id-readtalk'
    })
  });
  
  const tokens = await tokenResp.json();
  
  const userResp = await env.OPENAUTH.fetch('/userinfo', {
    headers: { 'Authorization': `Bearer ${tokens.access_token}` }
  });
  
  const user = await userResp.json(); // { id: "usr_123" }
  const keyId = user.id;
  
  // 2. Cek apakah udah pernah isi username
  const username = await env.PAGES_KV.get(`user:${keyId}:name`);
  
  if (username) {
    // Udah pernah → langsung ke account.html
    return Response.redirect(`/account.html?keyId=${keyId}&username=${username}`, 302);
  } else {
    // Belum pernah → tampilkan form
    return new Response(`
      <html>
        <body>
          <h1>Welcome!</h1>
          <form id="nameForm">
            <input id="username" placeholder="Your name" required>
            <button type="submit">Continue</button>
          </form>
          <script>
            document.getElementById('nameForm').onsubmit = async (e) => {
              e.preventDefault();
              const username = document.getElementById('username').value;
              
              await fetch('/api/save-username', {
                method: 'POST',
                body: JSON.stringify({ keyId: '${keyId}', username })
              });
              
              window.location.href = '/account.html?keyId=${keyId}&username=' + username;
            };
          </script>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}
