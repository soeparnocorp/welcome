// /functions/api/login.ts
// Route: /api/login (GET atau POST)

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Redirect ke OpenAuth authorize
  const authUrl = new URL("https://openauth.soeparnocorp.workers.dev/authorize");
  authUrl.searchParams.set("client_id", "your-client-id"); // ganti dengan client_id loe (dari Worker OpenAuth)
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", url.origin + "/api/callback"); // callback ke Pages
  authUrl.searchParams.set("scope", "openid"); // optional, kalau loe enable OIDC

  return Response.redirect(authUrl.toString(), 302);
}
