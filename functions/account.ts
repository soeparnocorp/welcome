// functions/account.ts
export async function onRequest(context) {
  const { env, request } = context;
  const cookie = request.headers.get("Cookie") || "";
  
  // 1. Ambil token dari cookie
  const match = cookie.match(/access_token=([^;]+)/);
  if (!match) return Response.redirect("/", 302);
  
  const token = match[1];
  
  try {
    // 2. Validasi token ke OpenAuth pake binding
    const userRes = await env.OPENAUTH.fetch('/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!userRes.ok) return Response.redirect("/", 302);
    
    const user = await userRes.json();
    const userId = user.id;
    
    // 3. Ambil username dari KV
    const username = await env.PAGES_KV.get(`user:${userId}:name`) || 'Guest';
    
    // 4. Redirect ke account.html dengan parameter
    return Response.redirect(`/account.html?userId=${userId}&username=${encodeURIComponent(username)}`, 302);
    
  } catch (error) {
    console.error('Account error:', error);
    return Response.redirect("/", 302);
  }
}
