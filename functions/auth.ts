// functions/auth.ts
export async function onRequest(context: PagesFunctionContext) {
  const { env } = context

  // Placeholder untuk internal OpenAuth Worker
  if (!env.OPENAUTH_WORKER) {
    return new Response(JSON.stringify({ error: "OPENAUTH_WORKER binding missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Simulasi login user
  const user = { id: "example-user-id", email: "user@example.com" }

  // Redirect ke halaman after-login
  const redirectAfterLogin = "/after-login.html"

  // Set cookie user_id (HttpOnly)
  const headers = new Headers({
    "Set-Cookie": `user_id=${user.id}; Path=/; HttpOnly; SameSite=Lax`,
  })

  // Redirect 302 → browser pindah otomatis ke after-login
  return Response.redirect(redirectAfterLogin, 302)
}
