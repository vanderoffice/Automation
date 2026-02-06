import { forwardRef } from 'react'

const variants = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white',
  secondary:
    'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-neutral-800 text-neutral-400',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    disabled,
    onClick,
    type = 'button',
    className = '',
  },
  ref
) {
  const base =
    'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50'
  const disabledClass = disabled
    ? ' opacity-50 cursor-not-allowed pointer-events-none'
    : ''

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={
        base +
        ' ' +
        (variants[variant] || variants.primary) +
        ' ' +
        (sizes[size] || sizes.md) +
        disabledClass +
        (className ? ' ' + className : '')
      }
    >
      {children}
    </button>
  )
})

export { Button }
