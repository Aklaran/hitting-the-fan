import { trpc } from '@/lib/trpc'
import { Outlet, createFileRoute } from '@tanstack/react-router'

function Login() {
  return (
    <div>
      <p>You gotta log in</p>
      <a href="/api/auth/login">Login</a>
    </div>
  )
}

function AuthenticatedComponent() {
  const { data, isError, error } = trpc.user.isAuthenticated.useQuery()

  if (isError) {
    console.error('Error in AuthenticatedComponent', error)
    return <Login />
  }

  if (!data) {
    return <Login />
  }

  return <Outlet />
}

export const Route = createFileRoute('/_authenticated')({
  // TODO: Is it better to get the query client into context so I can do
  //       auth check in the `beforeLoad`?
  component: AuthenticatedComponent,
})
