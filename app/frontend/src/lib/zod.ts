import { ZodString } from 'zod'

// NOTE: The Tanstack Form Zod Validation Adapter is a but fucked rn,
// so we're custom making our validator to get around it.
// Thus, this is probably not the best abstraction.
// Check back in to see if it gets fixed ever.

export function getZodStringValidationErrors(value: string, schema: ZodString) {
  const error = schema.safeParse(value).error
  return error
    ? error.issues.map((issue) => issue.message).join('\n')
    : undefined
}
