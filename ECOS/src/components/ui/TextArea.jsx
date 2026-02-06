import { forwardRef } from 'react'

const TextArea = forwardRef(function TextArea(
  {
    label,
    name,
    placeholder,
    value,
    onChange,
    error,
    required,
    disabled,
    rows = 4,
    className = '',
  },
  ref
) {
  const baseTextarea =
    'w-full bg-neutral-900 border rounded-lg px-4 py-2.5 text-neutral-200 placeholder-neutral-500 ' +
    'focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors duration-200 resize-vertical'

  const borderClass = error ? ' border-red-500' : ' border-neutral-700'
  const disabledClass = disabled ? ' opacity-50 cursor-not-allowed' : ''

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-300 mb-1"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
        className={baseTextarea + borderClass + disabledClass}
      />
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  )
})

export { TextArea }
