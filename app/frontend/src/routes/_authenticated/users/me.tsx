import { trpc } from '@/lib/trpc'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/users/me')({
  component: UserForm,
})

function UserForm() {
  const query = trpc.user.me.useQuery()

  return <div>{JSON.stringify(query.data)}</div>
}
