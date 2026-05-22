"use client"

import { useState } from "react"
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
import ResumeModal from "@/components/booking/ResumeModal"
import { useFormState } from "@/hooks/useFormState"

const getStepFlow = (service) => {
  switch (service) {
    case "alteration":
      return ["service", "date_alteration", "measurements_alteration", "email", "details", "review"]
    case "consultation":
      return ["service", "date_consultation", "email", "details", "review"]
    default:
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
    anonymousSessionId,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    restoreSession,
  } = useFormState()


  // Show resume modal on step 1 by default

  const [showResumeModal, setShowResumeModal] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("flowtrack_has_booking") === "true"
  })

  const handleResume = (session) => {
    restoreSession(session.formData, session.currentStep)
    setShowResumeModal(false)
  }

  const handleDismiss = () => {
    setShowResumeModal(false)
  }

  const service = formData.service || "custom_outfit"
  const flow = getStepFlow(service)
  const totalSteps = flow.length
  const currentStepKey = flow[currentStep - 1]

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
      case "service": return <StepOne {...stepProps} />
      case "date": return <StepTwo {...stepProps} />
      case "date_alteration": return <StepTwoAlteration {...stepProps} />
      case "date_consultation": return <StepTwoConsultation {...stepProps} />
      case "style": return <StepThree {...stepProps} />
      case "measurements": return <StepFour {...stepProps} />
      case "measurements_alteration": return <StepFour {...stepProps} alterationMode />
      case "email": return <StepFive {...stepProps} />
      case "details": return <StepSix {...stepProps} />
      case "review": return <StepSeven {...stepProps} />
      default: return <StepOne {...stepProps} />
    }
  }

  return (
    <BookingLayout currentStep={currentStep} totalSteps={totalSteps} flow={flow}>

      {/* Resume modal — shown on step 1 only */}
      {showResumeModal && currentStep === 1 && (
        <ResumeModal
          onResume={handleResume}
          onDismiss={handleDismiss}
        />
      )}

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