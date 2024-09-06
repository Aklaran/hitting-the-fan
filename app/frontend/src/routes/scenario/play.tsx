import { FormErrorMessage } from '@/components/custom-ui/formErrorMessage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getZodStringValidationErrors } from '@/lib/zod'
import { scenarioEngine } from '@shared/engine/scenarioEngine'
import { Scenario } from '@shared/types/scenario'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { z } from 'zod'

function PlayScenario() {
  const [scenario, setScenario] = useState<Scenario>({
    log: [
      {
        text: 'Your climbing partner just took a gnarly whip. You have lowered them to the bottom of the pitch and they are sitting there, clutching their ankle. They are still tied in to the rope, and you still have them on belay.',
        type: 'narrator',
      },
    ],
  })

  const logContainerRef = useRef<HTMLDivElement>(null)

  const form = useForm({
    defaultValues: {
      action: '',
    },

    onSubmit: async (values) => {
      const newScenario = scenarioEngine.processAction(
        values.value.action,
        scenario,
      )
      setScenario(newScenario)

      // Timeout needed to allow state to update & re-render before scroll
      setTimeout(() => {
        if (logContainerRef.current) {
          logContainerRef.current.scrollTo({
            top: logContainerRef.current.scrollHeight,
            behavior: 'smooth',
          })
        }
      })
    },
  })

  return (
    <div className="pt-2">
      <div className="flex flex-col justify-between gap-2 border rounded p-2 w-5/6 h-96 max-h-dvh mx-auto">
        <div
          ref={logContainerRef}
          className="overflow-y-auto overflow-x-hidden"
        >
          {scenario.log.map((log, index) => (
            <div key={index} className="flex gap-1 mb-2">
              {log.type === 'player' && <p>&gt;</p>}
              <p>{log.text}</p>
            </div>
          ))}
        </div>

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
                  className="border-r-0 border-l-0 border-b-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-t-white"
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="What are you gonna do?"
                />
                <FormErrorMessage errors={field.state.meta.touchedErrors} />
              </>
            )}
          />
        </form>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/scenario/play')({
  component: PlayScenario,
})
