// functions/auth.ts
import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async (context) => {
  // Placeholder: bisa panggil OPENAUTH_WORKER binding
  // const resp = await context.env.OPENAUTH_WORKER.fetch(context.request)

  // Redirect ke halaman setelah login
  return Response.redirect('/account.html', 302)
}
