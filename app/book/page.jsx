"use client"

import React from "react"
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

  // Centralized props for each step
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

  // Component mapping
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
      <div className="min-h-screen bg-gray-50/50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          
          {/* Main Card Container */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 transition-all duration-300">
            
            {/* Step Content */}
            <div className="p-8 md:p-12">
              <div className="transition-opacity duration-300 ease-in-out">
                {steps[currentStep]}
              </div>
            </div>

            {/* Error Feedback Area */}
            {error && (
              <div className="mx-8 mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Bottom Navigation Hints (Optional) */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Step {currentStep} of 7
            </p>
          </div>
        </div>
      </div>
    </BookingLayout>
  )
}