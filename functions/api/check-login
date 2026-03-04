// functions/check-login.ts
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // 1.
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  
  // 2.
  if (!userId || !email) {
    return new Response('Unauthorized: Missing credentials', { status: 401 });
    // ATAU redirect ke halaman login
    // return Response.redirect('/api/login', 302);
  }
  
  // 3.
  return Response.redirect(
    `https://account.soeparnocorp.workers.dev?userId=${userId}&email=${encodeURIComponent(email)}`,
    302
  );
}
