// functions/auth.ts
interface Env {
  OPENAUTH_WORKER: Fetcher;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // kalau ada code dari Worker callback → redirect ke frontend
  if (code) {
    return Response.redirect(`https://app-readtalk.pages.dev/?code=${code}`, 302);
  }

  // fetch langsung route Worker yang ada (/authorize)
  const response = await env.OPENAUTH_WORKER.fetch('/password/authorize');
  return response;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // ambil body POST dari frontend (email + code)
  const { email, code } = await request.json();

  // fetch ke Worker /verify (buat validasi code)
  const response = await env.OPENAUTH_WORKER.fetch('/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
    headers: { 'Content-Type': 'application/json' },
  });

  return response;
};
