export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // KALO ADA CODE DARI OPENAUTH
  const code = url.searchParams.get('code');
  if (code) {
    // Tukar code dapetin userId & email
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
    const user = await userResp.json();
    
    // Redirect ke account.html dengan data
    return Response.redirect(
      `/account.html?userId=${user.id}&email=${encodeURIComponent(user.email)}`,
      302
    );
  }
  
  // KALO UDAH PUNYA USER ID & EMAIL (dari redirect di atas)
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  
  if (!userId || !email) {
    return Response.redirect('/login', 302);
  }
  
  // Set cookie atau session kalo perlu
  const headers = new Headers();
  headers.append('Set-Cookie', `userId=${userId}; Path=/; Secure; Max-Age=3600`);
  
  // LANGSUNG SERVE account.html
  const accountHtml = await context.env.ASSETS.fetch('/account.html');
  return new Response(accountHtml.body, {
    status: 200,
    headers: { ...headers, 'Content-Type': 'text/html' }
  });
}
