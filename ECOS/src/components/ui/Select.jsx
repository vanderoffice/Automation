import { forwardRef } from 'react'

const Select = forwardRef(function Select(
  {
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder,
    error,
    disabled,
    className = '',
  },
  ref
) {
  const baseSelect =
    'w-full bg-neutral-900 border rounded-lg px-4 py-2.5 text-neutral-200 ' +
    'focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 ' +
    'transition-colors duration-200 appearance-none cursor-pointer'

  const borderClass = error ? ' border-red-500' : ' border-neutral-700'
  const disabledClass = disabled ? ' opacity-50 cursor-not-allowed' : ''

  const arrowSvg = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23a3a3a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'
  )

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={baseSelect + borderClass + disabledClass}
          style={{
            backgroundImage: `url("data:image/svg+xml,${arrowSvg}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '40px',
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  )
})

export { Select }
