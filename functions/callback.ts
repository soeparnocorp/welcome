export const onRequest: PagesFunction = async (context) => {
  const { request } = context
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  
  // Log untuk debugging (bisa dilihat di Cloudflare logs)
  console.log('Callback received with code:', code)
  
  // Kalau gak ada code, balikin ke halaman utama
  if (!code) {
    return Response.redirect('https://id-readtalk.pages.dev/', 302)
  }
  
  // Redirect ke halaman chat dengan code
  // 🔥 INI YANG LO MAU: langsung menuju ke chat.soeparnocorp.workers.dev
  return Response.redirect(`https://chat.soeparnocorp.workers.dev/?code=${code}`, 302)
}
