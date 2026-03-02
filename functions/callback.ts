// functions/callback.ts
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  
  if (!code) {
    return Response.redirect('https://id-readtalk.pages.dev/', 302)
  }
  
  try {
    // 1. Validasi code ke openauth
    const userResponse = await env.OPENAUTH_WORKER.fetch('/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    
    const user = await userResponse.json()
    // user = { id: '123', email: 'user@example.com' }
    
    // 2. Simpan session di KV
    const token = crypto.randomUUID()
    await env.PAGES_KV.put(`session:${token}`, JSON.stringify({
      userId: user.id,
      email: user.email,
      step: 'need_settings'  // butuh isi yourname
    }), { expirationTtl: 3600 })
    
    // 3. Redirect ke SETTINGS (isi yourname)
    return Response.redirect(`https://id-readtalk.pages.dev/settings?token=${token}`, 302)
    
  } catch (error) {
    console.error('Callback error:', error)
    return Response.redirect('https://id-readtalk.pages.dev/?error=auth_failed', 302)
  }
}
