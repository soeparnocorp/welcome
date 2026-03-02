// functions/callback.ts
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Jika tidak ada code, tendang balik ke landing page
  if (!code) {
    return Response.redirect('https://id-readtalk.pages.dev/', 302);
  }

  try {
    // 🔥 TAHAP 1: VALIDASI CODE (WAJIB!)
    // Panggil OpenAuth Worker via BINDING untuk validasi
    const userResponse = await env.OPENAUTH_WORKER.fetch('/user', { // Asumsi ada endpoint /user di worker
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!userResponse.ok) {
      throw new Error('Invalid code');
    }
    const user = await userResponse.json(); // Dapat data user: { email, id }

    // 🔥 TAHAP 2: BUAT SESSION (OPSIONAL, TAPI DIREKOMENDASIKAN)
    // Minta Chat Worker untuk membuat session bagi user ini via BINDING
    const sessionResponse = await env.CHAT_WORKER.fetch('/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, id: user.id })
    });
    const session = await sessionResponse.json(); // Dapat session token

    // 🔥 TAHAP 3: REDIRECT KE CHAT DENGAN TOKEN (BUKAN CODE ASLI!)
    // Redirect user ke Chat Worker dengan token session yang sudah dibuat
    return Response.redirect(`https://chat.soeparnocorp.workers.dev/?token=${session.token}`, 302);

  } catch (error) {
    console.error('Callback error:', error);
    // Jika gagal, tendang balik ke landing page dengan pesan error
    return Response.redirect('https://id-readtalk.pages.dev/?error=auth_failed', 302);
  }
}
