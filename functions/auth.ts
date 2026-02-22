interface Env {
  OPENAUTH_WORKER: Fetcher;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    return Response.redirect(`https://app-readtalk.pages.dev/?code=${code}`, 302);
  }

  const response = await env.OPENAUTH_WORKER.fetch('https://internal/');
  return response;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { email, code } = await request.json();
  
  const response = await env.OPENAUTH_WORKER.fetch('https://internal/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code })
  });
  
  return response;
};
