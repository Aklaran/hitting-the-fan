/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AboutImport } from './routes/about'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as IndexImport } from './routes/index'
import { Route as FlashcardsIndexImport } from './routes/flashcards/index'
import { Route as AuthenticatedUsersMeImport } from './routes/_authenticated/users/me'
import { Route as AuthenticatedFlashcardsNewImport } from './routes/_authenticated/flashcards/new'

// Create/Update Routes

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const FlashcardsIndexRoute = FlashcardsIndexImport.update({
  path: '/flashcards/',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedUsersMeRoute = AuthenticatedUsersMeImport.update({
  path: '/users/me',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedFlashcardsNewRoute = AuthenticatedFlashcardsNewImport.update(
  {
    path: '/flashcards/new',
    getParentRoute: () => AuthenticatedRoute,
  } as any,
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/flashcards/': {
      id: '/flashcards/'
      path: '/flashcards'
      fullPath: '/flashcards'
      preLoaderRoute: typeof FlashcardsIndexImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/flashcards/new': {
      id: '/_authenticated/flashcards/new'
      path: '/flashcards/new'
      fullPath: '/flashcards/new'
      preLoaderRoute: typeof AuthenticatedFlashcardsNewImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/users/me': {
      id: '/_authenticated/users/me'
      path: '/users/me'
      fullPath: '/users/me'
      preLoaderRoute: typeof AuthenticatedUsersMeImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRoute.addChildren({
    AuthenticatedFlashcardsNewRoute,
    AuthenticatedUsersMeRoute,
  }),
  AboutRoute,
  FlashcardsIndexRoute,
})

/* prettier-ignore-end */
