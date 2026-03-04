// functions/account.ts
export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // Ambil dari URL account.html?userId=xxx&email=yyy&username=zzz
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  const username = url.searchParams.get('welcome');
  
  // VALIDASI: Semua parameter harus ada
  if (!userId || !email) {
    return Response.redirect('/', 302);
  }
  
  // VALIDASI KE KV: Apakah data user valid?
  const storedUsername = await env.PAGES_KV.get(`user:${userId}:name`);
  
  // Kalo di KV ada username, pake yang di KV (lebih valid)
  const finalUsername = storedUsername || username || 'Guest';
  
  // Set cookie atau header
  const headers = new Headers();
  headers.append('Set-Cookie', `userId=${userId}; Path=/; Secure; Max-Age=3600`);
  
  // Serve account.html
  const accountHtml = await context.env.ASSETS.fetch('/account.html');
  const html = await accountHtml.text();
  
  // Inject data ke HTML (opsional)
  const finalHtml = html.replace(
    '</head>',
    `<script>window.USER_DATA = { userId: '${userId}', email: '${email}', username: '${finalUsername}' };</script></head>`
  );
  
  return new Response(finalHtml, {
    status: 200,
    headers: { ...headers, 'Content-Type': 'text/html' }
  });
}
