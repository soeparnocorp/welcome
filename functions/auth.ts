// functions/auth.ts
export const onRequest = async (context) => {
  const { env } = context;
  
  const authorizeUrl = new URL('/authorize', 'https://openauth.soeparnocorp.workers.dev');
  
  // Parameter OAuth2 standar
  authorizeUrl.searchParams.set('client_id', 'id-readtalk');
  authorizeUrl.searchParams.set('redirect_uri', 'https://id-readtalk.pages.dev/callback');
  authorizeUrl.searchParams.set('response_type', 'code');
  
  // Redirect user ke OpenAuth
  return Response.redirect(authorizeUrl.toString(), 302);
}
