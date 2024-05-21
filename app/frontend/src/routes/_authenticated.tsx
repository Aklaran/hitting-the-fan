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
  // TODO: Can I catch the 401 from this so it doesn't clutter the console?
  const { data } = trpc.user.me.useQuery()

  // TODO: Handle loading states instead of showing login during that time
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
