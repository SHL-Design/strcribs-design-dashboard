// /api/auth/[...route].js
// Handles Google OAuth flow: /api/auth/login and /api/auth/callback

import { google } from 'googleapis'

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'openid', 'email', 'profile',
]

function client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback`
  )
}

export default async function handler(req, res) {
  const { route } = req.query
  const action = Array.isArray(route) ? route[0] : route

  // GET /api/auth/login → redirect to Google
  if (action === 'login') {
    const url = client().generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    })
    return res.redirect(url)
  }

  // GET /api/auth/callback → exchange code for tokens
  if (action === 'callback') {
    const { code } = req.query
    if (!code) return res.redirect('/?error=no_code')
    try {
      const { tokens } = await client().getToken(code)
      // Store token in a secure httpOnly cookie (30-day expiry)
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
      res.setHeader('Set-Cookie', [
        `gat=${tokens.access_token}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
        `grt=${tokens.refresh_token || ''}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
      ])
      return res.redirect('/?auth=success')
    } catch (e) {
      console.error('OAuth error:', e)
      return res.redirect('/?error=auth_failed')
    }
  }

  // GET /api/auth/token → return current access token (for client-side sync)
  if (action === 'token') {
    const cookies = parseCookies(req.headers.cookie)
    const accessToken = cookies['gat']
    if (!accessToken) return res.status(401).json({ error: 'Not authenticated' })

    // Try to refresh if we have a refresh token
    if (cookies['grt']) {
      try {
        const oauth = client()
        oauth.setCredentials({ refresh_token: cookies['grt'] })
        const { credentials } = await oauth.refreshAccessToken()
        if (credentials.access_token) {
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
          res.setHeader('Set-Cookie', `gat=${credentials.access_token}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
          return res.json({ accessToken: credentials.access_token })
        }
      } catch { /* use existing token */ }
    }

    return res.json({ accessToken })
  }

  // GET /api/auth/logout
  if (action === 'logout') {
    res.setHeader('Set-Cookie', ['gat=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT', 'grt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'])
    return res.redirect('/')
  }

  res.status(404).end()
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('=').map(decodeURIComponent))
  )
}
