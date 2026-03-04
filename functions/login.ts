export async function onRequest() {
  const url = new URL("https://openauth.soeparnocorp.workers.dev/authorize");
  url.searchParams.set("client_id", "id-readtalk");
  url.searchParams.set("redirect_uri", "https://id-readtalk.pages.dev/api/callback");
  url.searchParams.set("response_type", "code");
  return Response.redirect(url.toString(), 302);
}
