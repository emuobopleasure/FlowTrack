"use client"

import { useState } from "react"
import BookingLayout from "@/components/booking/BookingLayout"
import StepOne from "@/components/booking/steps/StepOne"
import StepTwo from "@/components/booking/steps/StepTwo"
import StepThree from "@/components/booking/steps/StepThree"
import StepFour from "@/components/booking/steps/StepFour"
import StepFive from "@/components/booking/steps/StepFive"
import StepSix from "@/components/booking/steps/StepSix"
import StepSeven from "@/components/booking/steps/StepSeven"
import { useFormState } from "@/hooks/useFormState"

export default function BookPage() {
  const {
    currentStep,
    formData,
    updateFormData,
    updateMeasurements,
    nextStep,
    prevStep,
    anonymousSessionId,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
  } = useFormState()

  const stepProps = {
    formData,
    updateFormData,
    updateMeasurements,
    nextStep,
    prevStep,
    anonymousSessionId,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
  }

  const steps = {
    1: <StepOne {...stepProps} />,
    2: <StepTwo {...stepProps} />,
    3: <StepThree {...stepProps} />,
    4: <StepFour {...stepProps} />,
    5: <StepFive {...stepProps} />,
    6: <StepSix {...stepProps} />,
    7: <StepSeven {...stepProps} />,
  }

  return (
    <BookingLayout currentStep={currentStep}>
      {steps[currentStep]}
    </BookingLayout>
  )
}