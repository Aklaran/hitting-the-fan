import { SessionManager } from '@kinde-oss/kinde-typescript-sdk'
import connectPgSimple from 'connect-pg-simple'
import session, { SessionOptions } from 'express-session'

export const sessionOptions: SessionOptions = {
  store: new (connectPgSimple(session))({
    conObject: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false, // false is recommended for privacy, and we are forcing early session saves for anonymous users anyway
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

export interface ExtendedSessionManager extends SessionManager {
  saveSession(): Promise<void>
}

// Conforms to Kinde SessionManager interface
export const sessionManager = (
  req: Express.Request,
): ExtendedSessionManager => ({
  async saveSession(): Promise<void> {
    return new Promise((resolve, reject) => {
      // If session is not present, treat as error early
      if (!req.session) return reject(new Error('No session on request'))
      req.session.save((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  },

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
