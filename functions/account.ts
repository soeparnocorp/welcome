// functions/account.ts
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 1. AMBIL SEMUA PARAMETER DARI OPENAUTH
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');
  const welcome = url.searchParams.get('welcome'); // ← ADA welcome=true
  
  // 2. VALIDASI: WAJIB ADA userId & email
  if (!userId || !email) {
    return Response.redirect('/', 302);
  }
  
  // 3. LANGSUNG KE ACCOUNT WORKER DENGAN SEMUA PARAMETER
  let accountWorkerUrl = `https://id-readtalk.pages.dev/account?userId=${userId}&email=${encodeURIComponent(email)}`;
  
  // 4. TAMBAHKAN WELCOME KALO ADA
  if (welcome) {
    accountWorkerUrl += `&welcome=${welcome}`;
  }
  
  return Response.redirect(accountWorkerUrl, 302);
}
