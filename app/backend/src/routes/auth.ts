import express, { Router } from 'express'
import { kindeClient } from '../lib/clients/kinde'
import { sessionManager } from '../lib/clients/session'

// Authentication with Kinde
const authRouter: Router = express
  .Router()

  // Define routes related to authentication under /api/auth
  .get('/login', async (req, res) => {
    const loginUrl = await kindeClient.login(sessionManager(req))
    return res.redirect(loginUrl.toString())
  })

  .get('/register', async (req, res) => {
    const registerUrl = await kindeClient.register(sessionManager(req))
    return res.redirect(registerUrl.toString())
  })

  .get('/callback', async (req, res) => {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.url}`)
    await kindeClient.handleRedirectToApp(sessionManager(req), url)
    return res.redirect('/')
  })

  .get('/logout', async (req, res) => {
    const logoutUrl = await kindeClient.logout(sessionManager(req))
    return res.redirect(logoutUrl.toString())
  })

export default authRouter
