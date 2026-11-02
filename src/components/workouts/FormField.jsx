import { useId } from 'react'

// Label + input + error message, wired together for accessibility.
// `children` is a function that receives the props the input needs.
export default function FormField({ label, error, children, className = '' }) {
  const id = useId()
  const input = children({
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  })

  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id}>{label}</label>
      {input}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
