"use client"

import { useEffect } from "react"
import BookingLayout from "@/components/booking/BookingLayout"
import StepOne from "@/components/booking/steps/StepOne"
import StepTwo from "@/components/booking/steps/StepTwo"
import StepTwoAlteration from "@/components/booking/steps/StepTwoAlteration"
import StepTwoConsultation from "@/components/booking/steps/StepTwoConsultation"
import StepThree from "@/components/booking/steps/StepThree"
import StepFour from "@/components/booking/steps/StepFour"
import StepFive from "@/components/booking/steps/StepFive"
import StepSix from "@/components/booking/steps/StepSix"
import StepSeven from "@/components/booking/steps/StepSeven"
import { useFormState } from "@/hooks/useFormState"

/**
 * Step flow per service:
 *
 * Custom Outfit:       1 → 2 → 3 → 4 → 5 → 6 → 7
 * Alteration:         1 → 2alt → 4alt → 5 → 6 → 7
 * Consultation:       1 → 2con → 5 → 6 → 7
 *
 * We map an internal "position" (1-7) to actual step components
 * based on the selected service.
 */

const getStepFlow = (service) => {
  switch (service) {
    case "alteration":
      return ["service", "date_alteration", "measurements_alteration", "email", "details", "review"]
    case "consultation":
      return ["service", "date_consultation", "email", "details", "review"]
    default:
      // custom_outfit
      return ["service", "date", "style", "measurements", "email", "details", "review"]
  }
}

export default function BookPage() {
  const {
    currentStep,
    formData,
    updateFormData,
    updateMeasurements,
    updateAlterationMeasurements,
    nextStep,
    prevStep,
    resetToStep,
    anonymousSessionId,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
  } = useFormState()

  const service = formData.service || "custom_outfit"
  const flow = getStepFlow(service)
  const totalSteps = flow.length
  const currentStepKey = flow[currentStep - 1]

  // Create anonymous session on mount
  useEffect(() => {
    if (!anonymousSessionId) return
    fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anonymousSessionId }),
    }).catch(() => { })
  }, [anonymousSessionId])

  const stepProps = {
    formData,
    updateFormData,
    updateMeasurements,
    updateAlterationMeasurements,
    nextStep,
    prevStep,
    anonymousSessionId,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    totalSteps,
    currentStep,
  }

  const renderStep = () => {
    switch (currentStepKey) {
      case "service":
        return <StepOne {...stepProps} />
      case "date":
        return <StepTwo {...stepProps} />
      case "date_alteration":
        return <StepTwoAlteration {...stepProps} />
      case "date_consultation":
        return <StepTwoConsultation {...stepProps} />
      case "style":
        return <StepThree {...stepProps} />
      case "measurements":
        return <StepFour {...stepProps} />
      case "measurements_alteration":
        return <StepFour {...stepProps} alterationMode />
      case "email":
        return <StepFive {...stepProps} />
      case "details":
        return <StepSix {...stepProps} />
      case "review":
        return <StepSeven {...stepProps} />
      default:
        return <StepOne {...stepProps} />
    }
  }

  return (
    <BookingLayout currentStep={currentStep} totalSteps={totalSteps} flow={flow}>
      {renderStep()}
      {error && (
        <div
          className="mt-4 flex items-center gap-3 px-4 py-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl"
          role="alert"
        >
          <div className="w-2 h-2 rounded-full bg-error shrink-0" aria-hidden="true" />
          <p className="text-sm text-error font-medium">{error}</p>
        </div>
      )}
    </BookingLayout>
  )
}