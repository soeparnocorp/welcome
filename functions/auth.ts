// functions/auth.ts
export async function onRequest(context: PagesFunctionContext) {
  const { env } = context

  // Placeholder: call OPENAUTH_WORKER internal via service binding
  // (binding di wrangler.toml)
  if (!env.OPENAUTH_WORKER) {
    return new Response(JSON.stringify({ error: "OPENAUTH_WORKER binding missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Simulasi OpenAuth: di real setup, worker akan handle auth dan return user info
  const user = { id: "example-user-id", email: "user@example.com" }

  // Bisa redirect ke halaman after-login
  const redirectAfterLogin = "/after-login.html"

  // Set cookie atau header sesuai kebutuhan (placeholder)
  const headers = new Headers({
    "Content-Type": "application/json",
    "Set-Cookie": `user_id=${user.id}; Path=/; HttpOnly`,
    "Location": redirectAfterLogin,
  })

  return new Response(JSON.stringify({ message: "Login successful", user }), {
    status: 200, // bisa 302 jika mau redirect otomatis
    headers,
  })
}
