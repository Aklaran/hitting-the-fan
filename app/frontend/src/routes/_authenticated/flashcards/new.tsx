import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trpc } from '@/lib/trpc'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/flashcards/new')({
  component: FlashcardForm,
})

function FlashcardForm() {
  const mutation = trpc.flashcard.create.useMutation()

  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      question: '',
      answer: '',
    },
    validatorAdapter: zodValidator,
    onSubmit: async (values) => {
      const { question, answer } = values.value

      await mutation.mutateAsync({
        question,
        answer,
      })

      navigate({ to: '/flashcards' })
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
          {/* REFACTOR: Componentize form fields */}
          {/* TODO: Use shared type `createFlashcardSchema.shape.question to validate */}
          {/* FIXME: Nested type errors are fuuuucking this file up */}
          <form.Field
            name="question"
            validators={{
              onChange: z.string().min(3, 'Question is required.'),
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Question</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.touchedErrors ? (
                  <div className="text-red-500">
                    {field.state.meta.touchedErrors.map((error) =>
                      error?.toString(),
                    )}
                  </div>
                ) : null}
              </>
            )}
          />
          <form.Field
            name="answer"
            validators={{
              onChange: z.string().min(3, 'Answer is required.'),
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Answer</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.touchedErrors ? (
                  <div className="text-red-500">
                    {field.state.meta.touchedErrors.map((error) =>
                      error?.toString(),
                    )}
                  </div>
                ) : null}
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
