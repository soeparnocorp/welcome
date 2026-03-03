export const onRequest = async (context) => {
  const { env } = context;
  
  const authorizeUrl = new URL('/authorize', 'https://openauth.soeparnocorp.workers.dev');
  authorizeUrl.searchParams.set('redirect_uri', 'https://id-readtalk.pages.dev/auth/callback');
  authorizeUrl.searchParams.set('client_id', 'id-readtalk');
  authorizeUrl.searchParams.set('response_type', 'code');
  
  return Response.redirect(authorizeUrl.toString(), 302);
}
