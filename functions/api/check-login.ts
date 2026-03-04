// /api/check-login?userId=xxx&email=yyy
export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // 1. LANGSUNG ambil userId dari URL (GAK ADA CODE!)
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  
  if (!userId || !email) {
    return Response.redirect('/', 302);
  }
  
  // 2. CEK username di KV pake userId
  const username = await env.PAGES_KV.get(`user:${userId}:name`);
  
  if (username) {
    // UDAH PUNYA USERNAME → langsung ke chat
    return Response.redirect(`/account.html?userId=${userId}&username=${username}`, 302);
  } else {
    // BELUM PUNYA → tampilkan form
    return new Response(`
      <html>
        <body>
          <h2>Welcome ${email}!</h2>
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
                body: JSON.stringify({ userId: '${userId}', username })
              });
              
              window.location.href = '/account.html?userId=${userId}&username=' + username;
            };
          </script>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}
