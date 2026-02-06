import { useId } from 'react'

function Checkbox({ label, name, checked, onChange, disabled, description }) {
  const generatedId = useId()
  const inputId = name || generatedId

  return (
    <div className="flex items-start gap-3">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={inputId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={
            'appearance-none w-5 h-5 rounded border border-neutral-600 bg-neutral-900 ' +
            'checked:bg-orange-500 checked:border-orange-500 ' +
            'focus:outline-none focus:ring-2 focus:ring-orange-500/50 ' +
            'transition-all duration-200 cursor-pointer' +
            (disabled ? ' opacity-50 cursor-not-allowed' : '')
          }
        />
        {checked && (
          <svg
            className="absolute top-0 left-0 w-5 h-5 pointer-events-none text-white"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="5 10 8.5 13.5 15 7" />
          </svg>
        )}
      </div>
      <div>
        <label
          htmlFor={inputId}
          className={
            'text-sm text-neutral-300 cursor-pointer select-none' +
            (disabled ? ' opacity-50 cursor-not-allowed' : '')
          }
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
}

export { Checkbox }
