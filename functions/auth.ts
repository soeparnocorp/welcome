// functions/auth.ts
import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async (context) => {
  // Placeholder: bisa panggil binding OPENAUTH_WORKER di context.env.OPENAUTH_WORKER nanti
  return Response.redirect('/account.html', 302)
}
