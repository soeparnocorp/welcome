// functions/auth.ts
import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async ({ env, request }) => {
  // Placeholder panggilan internal ke OPENAUTH_WORKER
  // Pages Function hanya trigger worker binding, tidak fetch ke URL eksternal
  const workerResponse = await env.OPENAUTH_WORKER.fetch(request)

  // Return JSON sederhana sebagai tanda OpenAuth worker dipanggil
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
