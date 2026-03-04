// /api/check-login?code=xxx
export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  // TUKAR CODE DAPETIN USER ID
  const user = await tukarCode(code, env);
  
  // CEK USERNAME DI KV
  const username = await env.PAGES_KV.get(`user:${user.id}:name`);
  
  if (username) {
    // UDAH PERNAH → LANGSUNG KE CHAT
    return Response.redirect(`/account.html?userId=${user.id}&username=${username}`, 302);
  } else {
    // BARU → TAMPILIN FORM
    return new Response(`
      <form onsubmit="fetch('/api/save',{method:'POST',body:JSON.stringify({userId:'${user.id}',username:this.username.value})})">
        <input name="username" placeholder="Nama lo">
        <button>Masuk</button>
      </form>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}
