// functions/auth.ts
export async function onRequest(context) {
  try {
    // Panggil OpenAuth Worker via Service Binding (Worker Loader)
    const resp = await context.env.OPENAUTH_WORKER.fetch(context.request)
    const data = await resp.json()

    if (!data.user?.email || !data.user?.usernameID) {
      return new Response(JSON.stringify({ success: false, error: 'No user data' }), { status: 400 })
    }

    // Simpan user/session ke D1
    await context.env.PAGES_DB.prepare(
      `INSERT INTO users (email, usernameID) VALUES (?, ?) 
       ON CONFLICT(email) DO UPDATE SET last_login = CURRENT_TIMESTAMP`
    )
      .bind(data.user.email, data.user.usernameID)
      .run()

    // Simpan session di KV
    await context.env.PAGES_KV.put(`session:${data.user.usernameID}`, JSON.stringify(data.user))

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('OpenAuth Worker fetch failed', err)
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 })
  }
}
