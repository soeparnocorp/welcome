// functions/api/login.ts
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const authUrl = new URL("https://openauth.soeparnocorp.workers.dev/authorize");
  authUrl.searchParams.set("client_id", "id-readtalk");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", url.origin + "/api/callback");

  return Response.redirect(authUrl.toString(), 302);
}
