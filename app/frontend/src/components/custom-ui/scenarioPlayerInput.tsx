import { getZodStringValidationErrors } from '@/lib/zod'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormErrorMessage } from './formErrorMessage'

export function ScenarioPlayerInput({
  onSubmit,
  autoFocus = false,
}: {
  onSubmit: (value: { action: string }) => void
  autoFocus?: boolean
}) {
  const form = useForm({
    defaultValues: {
      action: '',
    },

    onSubmit: async (values) => {
      onSubmit(values.value)
      form.reset()
    },
  })

  return (
    <form
      className="flex items-center"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="action"
        validators={{
          onSubmit: ({ value }) => {
            const schema = z.string().min(1)
            return getZodStringValidationErrors(value, schema)
          },
        }}
        children={(field) => (
          <>
            <Label htmlFor={field.name} className="sr-only">
              player input
            </Label>
            <Label htmlFor={field.name}>&gt;</Label>
            <Input
              autoFocus={autoFocus}
              className="border-r-0 border-l-0 border-b-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-t-white"
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="What are you gonna do?"
            />
            <FormErrorMessage errors={field.state.meta.errors} />
          </>
        )}
      />
    </form>
  )
}
