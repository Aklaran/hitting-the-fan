import Button from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { Link } from '@tanstack/react-router'

export const NavBar = () => {
  return (
    <div className="p-2 flex justify-between">
      <div className="flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/flashcards" className="[&.active]:font-bold">
          Flashcards
        </Link>
        <Link to="/scenarios" className="[&.active]:font-bold">
          Scenarios
        </Link>
        <Link to="/flashcards/study" className="[&.active]:font-bold">
          Study
        </Link>
      </div>
      <AccountActionNavSection />
    </div>
  )
}
function AccountActionNavSection() {
  // TODO: Lol if only I had this in context. Can always give it another try!
  const { data, isError, error } = trpc.user.isAuthenticated.useQuery()

  if (isError) {
    console.error('Error in AuthenticatedComponent', error)
    return <UnauthenticatedNavSection />
  }

  if (!data) {
    return <UnauthenticatedNavSection />
  }

  return <AuthenticatedNavSection />
}

function UnauthenticatedNavSection() {
  return (
    <div className="flex gap-2">
      <Button asChild>
        <a href="/api/auth/login" className="[&.active]:font-bold">
          Login
        </a>
      </Button>
      <Button asChild>
        <a href="/api/auth/register" className="[&.active]:font-bold">
          Register
        </a>
      </Button>
    </div>
  )
}

function AuthenticatedNavSection() {
  return (
    <Link to="/users/me" className="[&.active]:font-bold">
      Profile
    </Link>
  )
}
