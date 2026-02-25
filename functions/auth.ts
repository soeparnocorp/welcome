export async function onRequestGet({ env }) {
  
  const response = await env.ACCOUNT_WORKER.fetch(
    new Request("https://internal-placeholder") // placeholder, bypass URL public
  )

  
  return response
}
