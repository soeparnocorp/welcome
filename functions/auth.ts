// functions/auth.ts
import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async (context) => {
  const { env, request } = context

  // Placeholder panggilan internal ke OPENAUTH_WORKER
  // Tidak fetch ke URL eksternal, langsung pakai binding
  const workerResponse = await env.OPENAUTH_WORKER.fetch(request)

  // Hanya contoh response JSON sederhana
  return new Response(
    JSON.stringify({
      message: 'OpenAuth worker triggered (placeholder)',
      status: workerResponse.status
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
