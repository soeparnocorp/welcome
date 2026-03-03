// /functions/account.ts
// Route: /account (atau rename file /functions/account/index.ts biar /account)

export async function onRequest(context) {
  const cookie = context.request.headers.get("Cookie") || "";
  if (!cookie.includes("access_token=")) {
    return Response.redirect("/", 302); // balik ke home kalau belum login
  }

  // Kalau mau, fetch user info dari /userinfo endpoint OpenAuth pake token
  // const userRes = await fetch("https://openauth.soeparnocorp.workers.dev/userinfo", {
  //   headers: { Authorization: `Bearer ${tokenFromCookie}` }
  // });
  // const user = await userRes.json();

  return new Response("Welcome to your account page! (Protected)", { status: 200 });
}
