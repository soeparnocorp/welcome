export const onRequest = async () => {
  const url = new URL('/authorize', 'https://openauth.soeparnocorp.workers.dev');
  url.searchParams.set('redirect_uri', 'https://id-readtalk.pages.dev/account');
  url.searchParams.set('client_id', 'id-readtalk');
  url.searchParams.set('response_type', 'code');
  return Response.redirect(url.toString(), 302);
}
