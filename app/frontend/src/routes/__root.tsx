import { Toaster } from '@/components/ui/sonner'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: Root,
})

const NavBar = () => {
  return (
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <Link to="/flashcards" className="[&.active]:font-bold">
        Flashcards
      </Link>
      <Link to="/users/me" className="[&.active]:font-bold">
        Profile
      </Link>
    </div>
  )
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <Outlet />
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  )
}
