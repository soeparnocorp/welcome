// functions/auth.ts
import type { PagesFunction } from '@cloudflare/pages'

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url)
  const token = url.searchParams.get('token')
  
  if (token) {
    // Simpan token di cookie atau session
    // Redirect ke halaman utama dengan status login
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/?login=success',
        'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`
      }
    })
  }
  
  // Jika tidak ada token, redirect ke halaman utama
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/'
    }
  })
}
