import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { Flashcard as FlashcardDisplay } from './components/custom-ui/flashcard'
import { trpc } from './lib/trpc'

const queryClient = new QueryClient()

const trpcClient = trpc.createClient({
  // TODO: Use environment variable
  links: [httpBatchLink({ url: 'http://localhost:5173/api' })],
})

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <FlashcardyCard />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

function FlashcardyCard() {
  const flashcardQuery = trpc.flashcard.get.useQuery({ id: 1 })

  return (
    flashcardQuery.data && (
      <FlashcardDisplay
        question={flashcardQuery.data?.question}
        answer={flashcardQuery.data?.answer}
      />
    )
  )
}

export default App
