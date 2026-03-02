// functions/auth.ts
export async function onRequest(context) {
  const url = new URL(context.request.url)
  const code = url.searchParams.get('code') // ambil ?code= dari OpenAuth
  const state = url.searchParams.get('state')

  if (!code) {
    return new Response(JSON.stringify({ error: 'Missing code' }), { status: 400 })
  }

  try {
    // Panggil OPENAUTH_WORKER untuk exchange code → token / user info
    const res = await context.env.OPENAUTH_WORKER.fetch(
      `https://openauth.soeparnocorp.workers.dev/token?code=${code}&state=${state}`
    )
    const data = await res.json()

    // Contoh simpan user info ke D1
    if (data.user?.email) {
      await context.env.PAGES_DB.prepare(
        `INSERT INTO users (email, usernameID) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET last_login = CURRENT_TIMESTAMP`
      )
      .bind(data.user.email, data.user.usernameID)
      .run()

      // Simpan juga session ke KV
      await context.env.PAGES_KV.put(`session:${data.user.usernameID}`, JSON.stringify(data.user))
    }

    // Redirect user ke room page setelah berhasil
    return Response.redirect('/room.html', 302)

  } catch (err) {
    console.error('OpenAuth failed:', err)
    return new Response(JSON.stringify({ error: 'OpenAuth failed' }), { status: 500 })
  }
}
