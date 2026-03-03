// functions/api/save-username.ts
export async function onRequest(context) {
  const { env, request } = context;
  
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  const { userId, username } = await request.json();
  
  // Simpan username di KV
  await env.PAGES_KV.put(`user:${userId}:name`, username);
  
  return new Response('OK', { status: 200 });
}
