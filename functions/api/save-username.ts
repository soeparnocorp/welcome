export const onRequest = async (context) => {
  const { env, request } = context;
  const { keyId, username } = await request.json();
  
  // Simpan di KV pake keyId
  await env.PAGES_KV.put(`user:${keyId}:name`, username);
  
  return new Response('OK');
}
