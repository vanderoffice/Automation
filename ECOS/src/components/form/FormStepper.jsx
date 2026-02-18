const STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Security' },
  { id: 3, label: 'Review' },
  { id: 4, label: 'Submit' },
]

function FormStepper({ currentStep, onStepClick }) {
  return (
    <div className="mb-8">
      {/* Desktop: full stepper */}
      <div className="hidden sm:flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isFuture = step.id > currentStep
          const isLast = i === STEPS.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => step.id < currentStep && onStepClick(step.id)}
                disabled={isFuture}
                className={
                  'flex items-center gap-2 group ' +
                  (isFuture ? 'cursor-not-allowed' : isCompleted ? 'cursor-pointer' : '')
                }
              >
                <div
                  className={
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ' +
                    (isCompleted
                      ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                      : isCurrent
                        ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-400'
                        : 'bg-neutral-800 border-2 border-neutral-600 text-neutral-500')
                  }
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={
                    'text-sm font-medium transition-colors ' +
                    (isCompleted
                      ? 'text-green-400 group-hover:text-green-300'
                      : isCurrent
                        ? 'text-orange-400'
                        : 'text-neutral-500')
                  }
                >
                  {step.label}
                </span>
              </button>
              {!isLast && (
                <div
                  className={
                    'flex-1 h-0.5 mx-3 ' +
                    (isCompleted ? 'bg-green-500/40' : 'bg-neutral-700')
                  }
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: compact indicator */}
      <div className="sm:hidden flex items-center justify-between">
        <span className="text-sm text-neutral-400">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-sm font-medium text-orange-400">
          {STEPS[currentStep - 1]?.label}
        </span>
        <div className="flex gap-1">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={
                'w-2 h-2 rounded-full ' +
                (step.id < currentStep
                  ? 'bg-green-500'
                  : step.id === currentStep
                    ? 'bg-orange-500'
                    : 'bg-neutral-700')
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StepNavigation({ currentStep, totalSteps, onBack, onNext, nextLabel, nextDisabled }) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-neutral-800 mt-8">
      {currentStep > 1 ? (
        <button
          onClick={onBack}
          className="text-sm text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          <span>←</span> Back
        </button>
      ) : (
        <div />
      )}
      {currentStep < totalSteps && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={
            'text-sm font-medium px-4 py-2 rounded-lg transition-all ' +
            (nextDisabled
              ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
              : 'bg-orange-500/15 text-orange-400 hover:bg-orange-500/25')
          }
        >
          {nextLabel || 'Next'} →
        </button>
      )}
    </div>
  )
}

export { FormStepper, StepNavigation }
