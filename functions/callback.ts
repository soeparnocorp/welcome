import type { PagesFunction } from '@cloudflare/pages'

interface Env {
  OPENAUTH_WORKER: Fetcher
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/' }
    })
  }

  try {
    const tokenResponse = await context.env.OPENAUTH_WORKER.fetch('https://openauth.soeparnocorp.workers.dev/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: 'your-client-id',
        redirect_uri: 'https://id-readtalk.pages.dev/callback'
      })
    })

    const tokenData = await tokenResponse.json()

    const userResponse = await context.env.OPENAUTH_WORKER.fetch('https://openauth.soeparnocorp.workers.dev/userinfo', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    })

    const userData = await userResponse.json()

    const sessionData = btoa(JSON.stringify({ user: userData }))

    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': `session=${sessionData}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
      }
    })

  } catch (error) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/' }
    })
  }
}
