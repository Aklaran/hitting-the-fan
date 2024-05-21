import {
  createKindeServerClient,
  GrantType,
} from '@kinde-oss/kinde-typescript-sdk'
import { CookieOptions, Request, Response } from 'express'

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    // TODO: Rip Nick's env var management file to remove need to force unwrap
    authDomain: process.env.KINDE_DOMAIN!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    redirectURL: process.env.KINDE_REDIRECT_URI!,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
  },
)

// Session Manager

// TODO: This is not production ready. Use express-session or something similar.

export const sessionManager = (req: Request, res: Response) => ({
  async getSessionItem(key: string) {
    return req.cookies ? req.cookies[key] : null
  },

  async setSessionItem(key: string, value: unknown) {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    }

    if (typeof value === 'string') {
      res.cookie(key, value, cookieOptions)
    } else {
      res.cookie(key, JSON.stringify(value), cookieOptions)
    }
  },

  async removeSessionItem(key: string) {
    res.clearCookie(key)
  },

  async destroySession() {
    const keys = ['id_token', 'access_token', 'user', 'refresh_token']

    keys.forEach((key) => {
      res.clearCookie(key)
    })
  },
})
