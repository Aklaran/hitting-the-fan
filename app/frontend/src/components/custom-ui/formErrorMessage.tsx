import { ValidationError } from '@tanstack/react-form'

export function FormErrorMessage({ errors }: { errors: ValidationError[] }) {
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
