export const onRequest: PagesFunction = async (context) => {
  const { request } = context
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  
  // Dapetin code dari worker, redirect ke halaman utama dengan code
  // Atau lo bisa proses di sini buat dapetin token
  
  return Response.redirect(`https://id-readtalk.pages.dev/?code=${code}`)
}
