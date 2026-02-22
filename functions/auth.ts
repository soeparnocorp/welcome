export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `https://app-readtalk.pages.dev/?code=${code}`
      }
    });
  }

  const response = await env.OPENAUTH_WORKER.fetch(
    new Request("https://internal-placeholder")
  );

  return response;
}

export async function onRequestPost({ request, env }) {
  const { email, code } = await request.json();

  const response = await env.OPENAUTH_WORKER.fetch(
    "https://internal/verify", {
      method: 'POST',
      body: JSON.stringify({ email, code })
    }
  );

  return response;
}
