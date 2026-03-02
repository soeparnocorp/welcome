import type { PagesFunction } from '@cloudflare/pages'

export const onRequest: PagesFunction = async (context) => {
  const cookie = context.request.headers.get('Cookie')
  
  if (!cookie) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const sessionMatch = cookie.match(/session=([^;]+)/)
  
  if (!sessionMatch) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const sessionData = JSON.parse(atob(sessionMatch[1]))
    return new Response(JSON.stringify({
      authenticated: true,
      user: sessionData.user
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
