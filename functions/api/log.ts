// functions/api/log.ts
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Balikin aja apa yang diterima
  return new Response(JSON.stringify({
    params: Object.fromEntries(url.searchParams),
    path: url.pathname
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
