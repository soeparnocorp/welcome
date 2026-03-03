// /functions/api/callback.ts
// Route: /api/callback?code=...

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No authorization code received", { status: 400 });
  }

  // Exchange code manual (karena lib client bisa dipake, tapi ini versi simpel tanpa lib tambahan)
  const tokenResponse = await fetch("https://openauth.soeparnocorp.workers.dev/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: url.origin + "/api/callback",
      client_id: "your-client-id", // sama seperti atas
      // Kalau pake PKCE: code_verifier juga harus dikirim (tapi kalau ga pake PKCE, skip)
    }),
  });

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text();
    return new Response("Token exchange failed: " + err, { status: 500 });
  }

  const tokens = await tokenResponse.json();

  // Simpen access_token di cookie (http-only lebih aman, tapi ini contoh simple)
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `access_token=${tokens.access_token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=3600`
  );

  // Redirect ke halaman account/protected
  return Response.redirect("/account.html", 302, { headers });
}
