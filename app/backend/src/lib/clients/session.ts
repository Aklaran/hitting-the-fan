import { SessionManager } from '@kinde-oss/kinde-typescript-sdk'
import connectPgSimple from 'connect-pg-simple'
import { Request } from 'express'
import session, { SessionOptions } from 'express-session'

export const sessionOptions: SessionOptions = {
  store: new (connectPgSimple(session))({
    conObject: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV == 'production',
    sameSite: 'lax',
  },
}

declare module 'express-session' {
  interface SessionData {
    [key: string]: unknown
    access_token: string
    ac_state_key: string
  }
}

// Conforms to Kinde SessionManager interface
export const sessionManager = (req: Request): SessionManager => ({
  async getSessionItem(key: string) {
    return req.session ? req.session[key] : null
  },

  async setSessionItem(key: string, value: unknown) {
    req.session[key] = value
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  },

  async removeSessionItem(key: string) {
    delete req.session[key]
  },

  async destroySession() {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session', err)
      }
    })
  },
})
