import type { PagesFunction } from '@cloudflare/pages'

export const onRequest: PagesFunction = async (context) => {
  const cookie = context.request.headers.get('Cookie')
  
  if (!cookie) {
    return Response.json({ authenticated: false })
  }

  const sessionMatch = cookie.match(/session=([^;]+)/)
  
  if (!sessionMatch) {
    return Response.json({ authenticated: false })
  }

  try {
    const sessionData = JSON.parse(atob(sessionMatch[1]))
    return Response.json({
      authenticated: true,
      user: sessionData.user
    })
  } catch {
    return Response.json({ authenticated: false })
  }
}
