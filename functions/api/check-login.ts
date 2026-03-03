// /functions/api/check-login.ts
// Route: /api/check-login

export async function onRequest(context) {
  const cookie = context.request.headers.get("Cookie") || "";
  const hasToken = cookie.includes("access_token=");

  return Response.json({ isLoggedIn: hasToken });
}
