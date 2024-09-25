import { FormErrorMessage } from '@/components/custom-ui/formErrorMessage'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trpc } from '@/lib/trpc'
import { getZodStringValidationErrors } from '@/lib/zod'
import { createScenarioSchema, patientSchema } from '@shared/types/scenario'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/scenarios/new')({
  component: ScenarioForm,
})

function ScenarioForm() {
  const mutation = trpc.scenario.create.useMutation()

  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      title: '',
      openingPrompt: '',
      initialState: {
        log: [],
        patient: {
          name: '',
          description: '',
          bodyParts: [],
          ailments: [],
          age: 0,
          gender: patientSchema.shape.gender.Values.male,
          heartRate: 0,
          respiratoryRate: 0,
          coreTemperatureCelsius: 0,
        },
        environment: {
          description: '',
          temperatureCelsius: 0,
        },
      },
    },

    onSubmit: async (values) => {
      const newScenario = values.value

      mutation.mutate(newScenario, {
        onSuccess: () => {
          navigate({ to: '/scenarios' })
        },
        onError: (error) => {
          console.error('Error creating scenario:', error)

          toast.error('Error creating scenario')
        },
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
            name="title"
            validators={{
              onChange: ({ value }) => {
                const schema = createScenarioSchema.shape.title
                return getZodStringValidationErrors(value, schema)
              },
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Title</Label>
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
            name="openingPrompt"
            validators={{
              onChange: ({ value }) => {
                const schema = createScenarioSchema.shape.openingPrompt
                return getZodStringValidationErrors(value, schema)
              },
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Opening Prompt</Label>
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
