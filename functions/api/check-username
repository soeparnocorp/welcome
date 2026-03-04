// /api/save
export async function onRequestPost(context) {
  const { env, request } = context;
  const { userId, username } = await request.json();
  await env.PAGES_KV.put(`user:${userId}:name`, username);
  return Response.redirect(`/account.html?userId=${userId}&username=${username}`, 302);
}
