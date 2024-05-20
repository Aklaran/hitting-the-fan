import express, { Router } from 'express'
import { kindeClient, sessionManager } from '../lib/middleware/kinde'

// Authentication with Kinde
const authRouter: Router = express
  .Router()

  // Define routes related to authentication under /api/auth
  .get('/login', async (req, res) => {
    const loginUrl = await kindeClient.login(sessionManager(req, res))
    return res.redirect(loginUrl.toString())
  })

  .get('/register', async (req, res) => {
    const registerUrl = await kindeClient.register(sessionManager(req, res))
    return res.redirect(registerUrl.toString())
  })

  .get('/callback', async (req, res) => {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.url}`)
    await kindeClient.handleRedirectToApp(sessionManager(req, res), url)
    return res.redirect('/')
  })

  .get('/logout', async (req, res) => {
    const logoutUrl = await kindeClient.logout(sessionManager(req, res))
    return res.redirect(logoutUrl.toString())
  })

  .get('/me', async (req, res) => {
    const isAuthenticated = await kindeClient.isAuthenticated(
      sessionManager(req, res),
    )
    if (isAuthenticated) {
      const user = await kindeClient.getUser(sessionManager(req, res))
      return res.json(user)
    } else {
      return res.status(401).json({ message: 'Unauthorized' })
    }
  })

export default authRouter
