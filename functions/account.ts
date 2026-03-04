// functions/account.ts
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 1. AMBIL DARI URL (YANG ADA)
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  
  // 2. VALIDASI SEDERHANA
  if (!userId || !email) {
    return Response.redirect('/', 302);
  }
  
  // 3. LANGSUNG KE ACCOUNT WORKER!
  return Response.redirect(
    `https://id-readtalk.pages.dev/account?userId=${userId}&email=${encodeURIComponent(email)}`,
    302
  );
}
