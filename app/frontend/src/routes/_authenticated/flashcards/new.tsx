import { FormErrorMessage } from '@/components/custom-ui/formErrorMessage'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trpc } from '@/lib/trpc'
import { getZodStringValidationErrors } from '@/lib/zod'
import { createFlashcardSchema } from '@shared/types/flashcard'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

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

    onSubmit: async (values) => {
      const { question, answer } = values.value

      // TODO: Catch this error and stop redirect
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
          <form.Field
            name="question"
            validators={{
              onChange: ({ value }) => {
                const schema = createFlashcardSchema.shape.question
                return getZodStringValidationErrors(value, schema)
              },
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
                <FormErrorMessage errors={field.state.meta.touchedErrors} />
              </>
            )}
          />
          <form.Field
            name="answer"
            validators={{
              onChange: ({ value }) => {
                const schema = createFlashcardSchema.shape.answer
                return getZodStringValidationErrors(value, schema)
              },
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
                <FormErrorMessage errors={field.state.meta.touchedErrors} />
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
