// functions/account.ts
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  
  if (!token) {
    return Response.redirect('/', 302)
  }
  
  // Ambil session dari KV
  const sessionData = await env.PAGES_KV.get(`session:${token}`)
  const session = JSON.parse(sessionData)
  
  // Ambil data user dari D1
  const user = await env.PAGES_DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(session.userId).first()
  
  const html = `<!DOCTYPE html>
<html>
<head><title>Account</title></head>
<body>
  <h1>Welcome, ${user.yourname}!</h1>
  <p>Email: ${user.email}</p>
  <p>User ID: ${user.id}</p>
  <hr>
  <a href="/lobby">Go to Lobby</a>
</body>
</html>`
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  })
}
