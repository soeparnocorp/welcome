// functions/callback.ts - Final Version
export const onRequest = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) return new Response('No code', { status: 400 });
  
  // 1. Tukar code dengan token
  const tokenResp = await env.OPENAUTH.fetch('/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://id-readtalk.pages.dev/callback',
      client_id: 'id-readtalk'
    })
  });
  
  const tokens = await tokenResp.json();
  
  // 2. Ambil user info (sekarang include email!)
  const userResp = await env.OPENAUTH.fetch('/userinfo', {
    headers: { 'Authorization': `Bearer ${tokens.access_token}` }
  });
  
  const user = await userResp.json(); // { id, email }
  const email = user.email;
  
  // 3. Cek username di KV
  let username = await env.PAGES_KV.get(`user:${email}:name`);
  
  if (username) {
    // User lama → langsung ke chat
    return Response.redirect(
      `https://account.soeparnocorp.workers.dev?email=${email}&username=${username}`,
      302
    );
  } else {
    // User baru → tampilkan form username
    return showUsernameForm(email, env);
  }
};
