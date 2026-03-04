// functions/api/log.ts
export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // Ambil dari parameter
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  
  if (!userId || !email) {
    return Response.redirect('/', 302);
  }
  
  // CEK KV: Apakah user sudah punya username?
  const username = await env.PAGES_KV.get(`user:${userId}:name`);
  
  // Redirect ke account.html dengan username (atau kosong)
  return Response.redirect(
    `/account.html?userId=${userId}&email=${encodeURIComponent(email)}&username=${username || ''}`,
    302
  );
}
