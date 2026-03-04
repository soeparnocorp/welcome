// functions/account.ts - VERSI PALING SEDERHANA
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // AMBIL PARAMETER DARI OPENAUTH
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  
  // KALO TIDAK ADA PARAMETER, TOLAK (tapi jangan redirect loop)
  if (!userId || !email) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // LANGSUNG KE ACCOUNT WORKER
  return Response.redirect(
    `https://id-readtalk.pages.dev/profile?userId=${userId}&email=${encodeURIComponent(email)}`,
    302
  );
}
