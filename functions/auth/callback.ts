import type { PagesFunction } from '@cloudflare/pages'

interface Env {
  OPENAUTH_CLIENT_ID: string
  OPENAUTH_CLIENT_SECRET: string
  OPENAUTH_TOKEN_URL: string
  OPENAUTH_USERINFO_URL: string
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
    const tokenResponse = await fetch(context.env.OPENAUTH_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: context.env.OPENAUTH_CLIENT_ID,
        client_secret: context.env.OPENAUTH_CLIENT_SECRET,
        redirect_uri: 'https://id-readtalk.pages.dev/auth/callback'
      })
    })

    const tokenData = await tokenResponse.json()

    const userResponse = await fetch(context.env.OPENAUTH_USERINFO_URL, {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    })

    const userData = await userResponse.json()

    const sessionData = JSON.stringify({
      access_token: tokenData.access_token,
      user: userData
    })

    const encodedSession = btoa(sessionData)

    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': `session=${encodedSession}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
      }
    })

  } catch (error) {
    console.error('Auth callback error:', error)
    return new Response(null, {
      status: 302,
      headers: { Location: '/' }
    })
  }
}
