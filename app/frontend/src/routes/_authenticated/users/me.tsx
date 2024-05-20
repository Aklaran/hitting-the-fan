import { trpc } from '@/lib/trpc'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/users/me')({
  component: UserForm,
})

function UserForm() {
  const { data } = trpc.user.me.useQuery()

  return (
    <div className="flex flex-col gap-4">
      {data && (
        <>
          <div>
            <strong>Name:</strong> {data.given_name} {data.family_name}
          </div>
          <div>
            <strong>Email:</strong> {data.email}
          </div>
          <a href="/api/auth/logout">Logout</a>
        </>
      )}
    </div>
  )
}
