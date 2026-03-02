// functions/auth.ts - VERSI FINAL (TINGGAL PAKE)
export async function onRequest(context) {
  const { request, env } = context
  const code = new URL(request.url).searchParams.get('code')
  
  // 🔥 VALIDASI KE OPENAUTH (BARU)
  const user = await env.OPENAUTH_WORKER.fetch('/user', {
    method: 'POST',
    body: JSON.stringify({ code })
  }).then(r => r.json())
  
  if (!user.valid) return Response.redirect('/', 302)
  
  // 🔥 KASIH TOKEN KE CHAT
  const token = await env.CHAT_WORKER.fetch('/token', {
    method: 'POST', 
    body: JSON.stringify({ email: user.email })
  }).then(r => r.text())
  
  return Response.redirect(`https://chat.workers.dev/?token=${token}`, 302)
}
