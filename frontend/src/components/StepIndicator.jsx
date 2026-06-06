// src/components/StepIndicator.jsx

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const isCompleted = step.status === 'completed';
        const isActive = step.status === 'active';
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                isCompleted ? 'bg-success-500 border-success-500 text-white' :
                isActive ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' :
                'bg-surface border-border text-textDim'
              }`}>
                {isCompleted ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary-400' : isCompleted ? 'text-success-400' : 'text-textDim'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mx-1 mt-[-1rem] ${isCompleted ? 'bg-success-500' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
