// functions/callback.ts
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  
  if (!code) {
    return Response.redirect('https://id-readtalk.pages.dev/', 302)
  }
  
  try {
    // 1. Validasi code ke OPENAUTH_WORKER
    const userResponse = await env.OPENAUTH_WORKER.fetch('/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    
    const user = await userResponse.json()
    // user = { id: '123', email: 'user@example.com' }
    
    // 2. Simpan session di PAGES_KV
    const token = crypto.randomUUID()
    await env.PAGES_KV.put(`session:${token}`, JSON.stringify({
      userId: user.id,
      email: user.email,
      step: 'new_user'  // tanda baru login
    }), { expirationTtl: 3600 }) // 1 jam
    
    // 3. Simpan user di PAGES_DB (kalo belum ada)
    await env.PAGES_DB.prepare(
      `INSERT OR IGNORE INTO users (id, email, created_at) 
       VALUES (?, ?, ?)`
    ).bind(user.id, user.email, Date.now()).run()
    
    // 4. REDIRECT KE SETTINGS_WORKER (account)
    //    untuk isi form Yourname
    const accountUrl = new URL('https://account.soeparnocorp.workers.dev')
    accountUrl.searchParams.set('token', token)
    accountUrl.searchParams.set('user_id', user.id)
    accountUrl.searchParams.set('email', user.email)
    
    return Response.redirect(accountUrl.toString(), 302)
    
  } catch (error) {
    console.error('Callback error:', error)
    return Response.redirect('https://id-readtalk.pages.dev/?error=auth_failed', 302)
  }
}
