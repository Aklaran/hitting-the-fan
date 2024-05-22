import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-8xl font-bold mb-8">💩 ➡ 🪭</h1>
      <p className="text-xl mb-4">What're you gonna do?</p>
      <Link to="/flashcards" className="text-blue-500 hover:underline">
        Start Studying Flashcards
      </Link>
    </div>
  )
}
