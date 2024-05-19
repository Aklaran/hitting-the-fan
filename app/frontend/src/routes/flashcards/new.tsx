import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trpc } from '@/lib/trpc'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/flashcards/new')({
  component: FlashcardForm,
})

function FlashcardForm() {
  const mutation = trpc.flashcard.create.useMutation()

  const form = useForm({
    defaultValues: {
      question: '',
      answer: '',
    },
    onSubmit: async (values) => {
      const { question, answer } = values.value
      mutation.mutate({
        question,
        answer,
      })
    },
  })

  return (
    <div className="max-w-3xl m-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          <form.Field
            name="question"
            children={(field) => (
              <>
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  name="question"
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />
          <form.Field
            name="answer"
            children={(field) => (
              <>
                <Label htmlFor="answer">Answer</Label>
                <Input
                  id="answer"
                  name="answer"
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}
