// functions/api/callback.ts
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No authorization code received", { status: 400 });
  }

  try {
    // 1. PAKE BINDING, BUKAN FETCH!
    const tokenResp = await env.OPENAUTH.fetch('/token', {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: url.origin + '/api/callback',
        client_id: 'id-readtalk'
      })
    });

    if (!tokenResp.ok) {
      const err = await tokenResp.text();
      return new Response("Token exchange failed: " + err, { status: 500 });
    }

    const tokens = await tokenResp.json();

    // 2. Ambil user info (dapet userId)
    const userResp = await env.OPENAUTH.fetch('/userinfo', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` }
    });

    if (!userResp.ok) {
      return new Response("Failed to get user info", { status: 500 });
    }

    const user = await userResp.json();
    const userId = user.id;

    // 3. Cek username di KV
    const username = await env.PAGES_KV.get(`user:${userId}:name`);

    // 4. Set cookie
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `access_token=${tokens.access_token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=3600`
    );

    // 5. Redirect sesuai kondisi
    if (username) {
      // UDAH PUNYA USERNAME → langsung ke account.html
      return Response.redirect(`/account.html?userId=${userId}&username=${encodeURIComponent(username)}`, 302, { headers });
    } else {
      // BELUM PUNYA USERNAME → ke form
      return Response.redirect(`/api/check-login?userId=${userId}`, 302, { headers });
    }

  } catch (error) {
    console.error('Callback error:', error);
    return new Response("Authentication failed", { status: 500 });
  }
}
