

interface CartStepsProps {
    totalSteps: number
    currentStep: number
    stepName: string
}

export default function CartSteps({ totalSteps, currentStep, stepName }: CartStepsProps) {
    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <div className="flex gap-2">

                {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1
                    const isCurrentStep = stepNumber === currentStep
                    const isCompletedStep = stepNumber < currentStep

                    const bg = isCurrentStep ? 'bg-brand-green' : 'bg-brand-green-accent'

                    return (
                        <div key={index} className={`${bg} rounded-lg w-6 md:w-10 h-2 md:h-4`}></div>
                    )
                })}

            </div>
            <span className="text-sm md:text-lg font-semibold">{stepName}</span>
        </div>
    )
}