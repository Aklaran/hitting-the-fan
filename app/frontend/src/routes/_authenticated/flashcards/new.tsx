import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trpc } from '@/lib/trpc'
import { ValidationError, useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
          {/* TODO: Use shared type `createFlashcardSchema.shape.question to validate */}
          <form.Field
            name="question"
            // NOTE: The Tanstack Form Zod Validation Adapter is a but fucked rn,
            // so we're custom making our validator to get around it.
            // Check back in to see if it gets fixed ever.
            validators={{
              onChange: ({ value }) => {
                const schema = z.string().min(3, 'Question is required.')
                const error = schema.safeParse(value).error

                return error
                  ? error.issues.map((issue) => issue.message).join('\n')
                  : undefined
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
                const schema = z.string().min(3, 'Answer is required.')
                const error = schema.safeParse(value).error

                return error
                  ? error.issues.map((issue) => issue.message).join('\n')
                  : undefined
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

function FormErrorMessage({ errors }: { errors: ValidationError[] }) {
  return (
    <>
      {errors ? (
        <div className="text-red-500">
          {errors.map((error) => error?.toString())}
        </div>
      ) : null}
    </>
  )
}
