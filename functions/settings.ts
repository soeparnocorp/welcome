// functions/settings.ts
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  
  // HANDLE POST (FORM SUBMIT)
  if (request.method === 'POST') {
    const formData = await request.formData()
    const yourname = formData.get('yourname')
    const token = formData.get('token')
    
    // Ambil session dari KV
    const sessionData = await env.PAGES_KV.get(`session:${token}`)
    const session = JSON.parse(sessionData)
    
    // Simpan yourname di D1
    await env.PAGES_DB.prepare(
      `UPDATE users SET yourname = ? WHERE id = ?`
    ).bind(yourname, session.userId).run()
    
    // Update session
    session.step = 'completed'
    session.yourname = yourname
    await env.PAGES_KV.put(`session:${token}`, JSON.stringify(session))
    
    // Redirect ke ACCOUNT
    return Response.redirect(`https://id-readtalk.pages.dev/account?token=${token}`, 302)
  }
  
  // HANDLE GET (TAMPILIN FORM)
  if (!token) {
    return Response.redirect('/', 302)
  }
  
  const sessionData = await env.PAGES_KV.get(`session:${token}`)
  const session = JSON.parse(sessionData)
  
  const html = `<!DOCTYPE html>
<html>
<head><title>Complete Profile</title></head>
<body>
  <h2>Welcome ${session.email}!</h2>
  <p>Please enter your name to continue:</p>
  
  <form method="POST">
    <input type="hidden" name="token" value="${token}">
    <input type="text" name="yourname" placeholder="Your name" required>
    <button type="submit">Continue</button>
  </form>
</body>
</html>`
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  })
}
