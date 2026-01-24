export async function onRequestGet({ env }) {
  // Memanggil Worker OpenAuth via service binding
  // env.OPENAUTH_WORKER → nama binding di Cloudflare dashboard / wrangler.toml
  const response = await env.OPENAUTH_WORKER.fetch(
    new Request("https://internal-placeholder") // placeholder, bypass URL publik
  )

  // Return response langsung (redirect, JSON, dsb)
  return response
}
