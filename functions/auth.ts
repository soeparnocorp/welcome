// functions/auth.ts
export async function onRequest(context) {
  try {
    // Panggil OPENAUTH_WORKER (repo OpenAuth)
    const res = await context.env.OPENAUTH_WORKER.fetch(
      'https://openauth.soeparnocorp.workers.dev/api/token',
      { method: 'POST' }
    )

    const data = await res.json()

    if (!data.user?.email) {
      return new Response(JSON.stringify({ success: false, error: 'No user data returned' }), { status: 400 })
    }

    // Simpan user ke D1
    await context.env.PAGES_DB.prepare(
      `INSERT INTO users (email, usernameID) VALUES (?, ?) 
       ON CONFLICT(email) DO UPDATE SET last_login = CURRENT_TIMESTAMP`
    )
    .bind(data.user.email, data.user.usernameID)
    .run()

    // Simpan session ke KV
    await context.env.PAGES_KV.put(`session:${data.user.usernameID}`, JSON.stringify(data.user))

    // Return JSON → SPA handle redirect
    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (err) {
    console.error('OpenAuth call failed:', err)
    return new Response(JSON.stringify({ success: false, error: 'OpenAuth call failed' }), { status: 500 })
  }
}
