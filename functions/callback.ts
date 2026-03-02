export async function onRequest(context) {
  const { request, env } = context
  const code = new URL(request.url).searchParams.get('code')
  
  // 🔥 1. Validasi code ke openauth worker
  const user = await env.OPENAUTH_WORKER.fetch('/verify', {
    method: 'POST',
    body: JSON.stringify({ code })
  }).then(r => r.json())
  
  if (!user.valid) {
    return Response.redirect('/', 302) // Gak valid, tendang balik
  }
  
  // 🔥 2. Minta session token dari chat worker
  const session = await env.CHAT_WORKER.fetch('/create-session', {
    method: 'POST',
    body: JSON.stringify({ 
      email: user.email,
      id: user.id 
    })
  }).then(r => r.json())
  
  // 🔥 3. Redirect dengan token (bukan code asli!)
  return Response.redirect(`https://chat.soeparnocorp.workers.dev/?token=${session.token}`, 302)
}
