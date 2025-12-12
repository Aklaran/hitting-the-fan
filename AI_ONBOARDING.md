# AI Agent Onboarding Guide

Welcome! This document will help you understand the codebase structure, conventions, and how to effectively contribute to this project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Code Organization](#code-organization)
5. [Development Workflow](#development-workflow)
6. [Key Patterns](#key-patterns)
7. [Common Tasks](#common-tasks)
8. [Testing](#testing)
9. [Deployment](#deployment)

## Project Overview

**Hitting the Fan** is a medical scenario training application built as a TypeScript monorepo. It combines:

- Interactive medical scenarios (game-like training)
- Flashcard system with spaced repetition
- User progress tracking

### Tech Stack

**Backend:**

- Node.js + Express.js
- tRPC for type-safe APIs
- Prisma ORM + PostgreSQL
- Kinde for authentication
- Pino for logging

**Frontend:**

- React 18+
- Vite
- TanStack Router
- Tailwind CSS + shadcn/ui components
- tRPC React Query integration

**Infrastructure:**

- Docker + Docker Compose
- Nginx reverse proxy
- pnpm workspaces

## Architecture

### Monorepo Structure

```
hitting-the-fan/
├── app/
│   ├── backend/          # Express server
│   │   ├── src/
│   │   │   ├── routes/   # tRPC routers
│   │   │   ├── services/ # Business logic
│   │   │   ├── repositories/ # Data access
│   │   │   ├── engine/   # Scenario game engine
│   │   │   └── lib/      # Utilities
│   │   └── prisma/       # Database schema & migrations
│   ├── frontend/         # React app
│   │   └── src/
│   │       ├── routes/   # TanStack Router pages
│   │       ├── components/ # React components
│   │       └── lib/      # Utilities
│   └── shared/           # Shared code
│       ├── types/        # TypeScript types
│       └── util/         # Shared utilities
├── cypress/              # E2E tests
└── bin/                  # Shell scripts
```

### Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
// ✅ Good
import { ScenarioState } from '@shared/types/scenario'
import { flashcardService } from '@backend/services/flashcardService'

// ❌ Bad
import { ScenarioState } from '../../../shared/types/scenario'
```

Available aliases:

- `@backend/*` → `./app/backend/src/*`
- `@frontend/*` → `./app/frontend/src/*`
- `@shared/*` → `./app/shared/*`

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker (for local database or full stack)
- PostgreSQL (or use Docker)

### Initial Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database:**

   ```bash
   cd app/backend
   pnpm migrate:dev  # Create database schema
   pnpm seed         # Seed initial data
   ```

4. **Start development:**

   ```bash
   pnpm dev  # Starts both backend and frontend
   ```

   Or separately:

   ```bash
   pnpm dev:backend   # Backend on port 3000
   pnpm dev:frontend  # Frontend on port 5173
   ```

### Development URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5173/api/trpc (proxied through Vite)
- Direct Backend: http://localhost:3000/api/trpc

## Code Organization

### Backend Layers

The backend follows a layered architecture:

1. **Routes** (`routes/`) - tRPC routers, handle HTTP concerns
2. **Services** (`services/`) - Business logic, orchestration
3. **Repositories** (`repositories/`) - Data access, Prisma queries
4. **Engine** (`engine/`) - Scenario game engine logic

**Example flow:**

```
Route → Service → Repository → Database
         ↓
      Engine (for scenarios)
```

### Frontend Structure

- **Routes** (`routes/`) - Page components using TanStack Router
- **Components** (`components/`) - Reusable UI components
  - `ui/` - shadcn/ui base components
  - `custom-ui/` - Application-specific components
- **Hooks** (`hooks/`) - Custom React hooks
- **Lib** (`lib/`) - Utilities, tRPC client setup

### Shared Types

All shared types live in `app/shared/types/`:

- `scenario/` - Scenario engine types (actions, commands, state, etc.)
- `flashcard.ts` - Flashcard types
- `user.ts` - User types
- `srs.ts` - Spaced repetition types

**Always use shared types** for data structures used by both frontend and backend.

## Development Workflow

### Making Changes

1. **Create a feature branch** (if using Git)
2. **Make your changes** following existing patterns
3. **Run linter:** `pnpm lint`
4. **Check types:** `pnpm build:frontend` (includes type check)
5. **Run tests:** `pnpm test`
6. **Test manually** in development environment

### Code Style

- **TypeScript:** Strict mode enabled, prefer types over `any`
- **ESLint:** Configured in `.eslintrc.js`
- **Prettier:** Auto-formats on save (configured in `.prettierrc.js`)
- **Imports:** Sorted automatically by Prettier plugin

### Git Workflow

- Commit messages: Use atomic, conventional commits if possible
- Before committing: Run `pnpm lint` and ensure build passes

## Key Patterns

### tRPC Route Pattern

```typescript
// app/backend/src/routes/flashcards.ts
import { router } from '@backend/lib/clients/trpc'
import { flashcardService } from '@backend/services/flashcardService'

export default router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return flashcardService.getAll(ctx.user?.id)
  }),

  create: publicProcedure
    .input(z.object({ question: z.string(), answer: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return flashcardService.create(input, ctx.user?.id)
    }),
})
```

### Service Pattern

```typescript
// app/backend/src/services/flashcardService.ts
import { flashcardRepository } from '@backend/repositories/flashcardRepository'

export const flashcardService = {
  async getAll(userId?: number) {
    return flashcardRepository.findAll(userId)
  },

  async create(data: CreateFlashcardInput, userId?: number) {
    // Business logic here
    return flashcardRepository.create(data)
  },
}
```

### Repository Pattern

```typescript
// app/backend/src/repositories/flashcardRepository.ts
import { prisma } from '@backend/lib/clients/prisma'

export const flashcardRepository = {
  async findAll(userId?: number) {
    return prisma.flashcard.findMany({
      // Prisma query
    })
  },
}
```

### Frontend tRPC Usage

```typescript
// In a React component
import { trpc } from '@frontend/lib/trpc'

function MyComponent() {
  const { data, isLoading } = trpc.flashcard.getAll.useQuery()
  const createMutation = trpc.flashcard.create.useMutation()

  // Use data and mutations
}
```

## Common Tasks

### Adding a New tRPC Endpoint

1. **Add procedure to router** (`app/backend/src/routes/[name].ts`):

   ```typescript
   export default router({
     newEndpoint: publicProcedure
       .input(
         z.object({
           /* schema */
         }),
       )
       .query(async ({ ctx, input }) => {
         // Implementation
       }),
   })
   ```

2. **Add to root router** (`app/backend/src/routes/root.ts`):

   ```typescript
   const appRouter = router({
     // ... existing routers
     newRouter: newRouter,
   })
   ```

3. **Use in frontend:**
   ```typescript
   trpc.newRouter.newEndpoint.useQuery()
   ```

### Adding a Database Model

1. **Update Prisma schema** (`app/backend/prisma/schema.prisma`):

   ```prisma
   model NewModel {
     id Int @id @default(autoincrement())
     // fields
   }
   ```

2. **Create migration:**

   ```bash
   cd app/backend
   pnpm migrate:dev --name add_new_model
   ```

3. **Generate Prisma client:**

   ```bash
   cd app/backend
   pnpm generate
   ```

4. **Create repository** (`app/backend/src/repositories/newModelRepository.ts`)

5. **Create service** if needed (`app/backend/src/services/newModelService.ts`)

### Adding a Frontend Page

1. **Create route file** (`app/frontend/src/routes/new-page.tsx`):

   ```typescript
   import { createFileRoute } from '@tanstack/react-router'

   export const Route = createFileRoute('/new-page')({
     component: NewPageComponent,
   })

   function NewPageComponent() {
     return <div>New Page</div>
   }
   ```

2. **TanStack Router will auto-discover** the route file

### Adding a Scenario Verb Handler

The scenario engine processes user commands. To add a new verb:

1. **Create handler** (`app/backend/src/engine/handlers/verbHandlers/newVerbHandler.ts`):

   ```typescript
   export const newVerbHandler: VerbHandler = async (command, context) => {
     // Process command
     return actionResponse
   }
   ```

2. **Register in engine** (`app/backend/src/engine/scenarioEngine.ts`):

   ```typescript
   const verbHandlers: Record<Verb, VerbHandler> = {
     // ... existing handlers
     newVerb: newVerbHandler,
   }
   ```

3. **Add guards/transformers** as needed in respective directories

## Testing

### Unit Tests

- Location: `*.test.ts` files next to source files
- Framework: Jest
- Run: `pnpm test`
- Example:

  ```typescript
  import { myFunction } from './myModule'

  describe('myFunction', () => {
    it('should do something', () => {
      expect(myFunction()).toBe(expected)
    })
  })
  ```

### E2E Tests

- Location: `cypress/e2e/`
- Framework: Cypress
- Run: `pnpm test:cypress`
- Config: `cypress.config.ts`

### Lint Tests

- Run: `pnpm test:lint`
- Ensures code follows linting rules

## Deployment

### Local Docker Setup

```bash
docker compose up
```

### Production Deployment

1. **Build:**

   ```bash
   pnpm build
   ```

2. **Deploy:**
   ```bash
   ./deploy.sh
   ```

See `QUICKSTART.md` and `DEPLOYMENT.md` for detailed deployment instructions.

### Environment Variables

- Development: `.env` file (not committed)
- Production: Docker environment variables
- Template: `.env.example`

**Required variables:**

- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption secret
- Kinde OAuth credentials
- `PORT` - Backend port (default: 3000)

## Important Concepts

### Scenario Engine

The core game engine processes medical scenario commands:

- **Verbs**: look, palpate, measure, ask, instruct, move, survey, wear, control, remove, perform, apply
- **State**: Stored as JSON in database, includes patient state, inventory, environment
- **Handlers**: Process verb actions
- **Guards**: Validate actions before execution
- **Transformers**: Modify state
- **Enrichers**: Add context to scenarios

### Spaced Repetition System

- Uses `ts-fsrs` library
- Flashcards have states: New, Learning, Review, Relearning
- User progress tracked per flashcard
- Review scheduling based on FSRS algorithm

### Authentication Flow

1. User authenticates via Kinde OAuth
2. Session created and stored in PostgreSQL
3. User context available in tRPC via `createContext`
4. Protected routes check `ctx.user`

### Reverse Proxy

- **Development**: Vite dev server proxies `/api/*` to backend
- **Production**: Nginx serves frontend and proxies `/api/*` to backend
- All API requests go through proxy, never directly to backend port

## Troubleshooting

### Type Errors

- Run `pnpm build:frontend` to check all types
- Ensure Prisma client is generated: `cd app/backend && pnpm generate`
- Check path aliases are correct

### Database Issues

- Ensure migrations are up to date: `cd app/backend && pnpm migrate:dev`
- Check `.env` has correct `DATABASE_URL`
- Verify PostgreSQL is running

### Build Issues

- Clear caches: `pnpm clean`
- Reinstall: `rm -rf node_modules && pnpm install`
- Check Node.js version: `node --version` (should be 18+)

### Import Errors

- Use path aliases (`@backend/*`, `@frontend/*`, `@shared/*`)
- Check `tsconfig.json` paths configuration
- Ensure file extensions match (`.ts` vs `.tsx`)

## Resources

- **Project README**: `README.md`
- **Quick Start**: `QUICKSTART.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Cursor Rules**: `.cursorrules` (for AI agents)
- **Package Scripts**: See `package.json` scripts section

## Best Practices

1. **Always use shared types** for data structures used by both frontend and backend
2. **Follow the layered architecture** (Route → Service → Repository)
3. **Use path aliases** instead of relative imports
4. **Run linter** before committing
5. **Write tests** for new features
6. **Document complex logic** with comments
7. **Follow existing patterns** in similar files
8. **Keep components small** and focused
9. **Use TypeScript strictly** - avoid `any` when possible
10. **Check both dev and prod** setups work

## Questions?

- Check existing code for patterns
- Review similar implementations
- Consult `.cursorrules` for project-specific guidelines
- Read TypeScript/React/tRPC documentation for framework questions

Happy coding! 🚀
