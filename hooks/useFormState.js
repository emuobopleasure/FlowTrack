"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

const initialFormData = {
  service: "custom_outfit",
  appointmentDate: "",
  appointmentTime: "",
  measurementType: "",
  alterationDetails: "",
  consultationFormat: "",
  measurements: {
    chest: "", waist: "", hips: "",
    shoulder: "", height: "", sleeve: "", notes: "",
  },
  alterationMeasurements: {
    chest: "", waist: "", hips: "",
    shoulder: "", height: "", sleeve: "", notes: "",
  },
  outfitStyle: "",
  email: "",
  name: "",
  phone: "",
  specialRequests: "",
}

export const useFormState = () => {
  const [currentStep, setCurrentStep]   = useState(1)
  const [formData, setFormData]         = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]               = useState(null)

  const [anonymousSessionId] = useState(() => uuidv4())

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }))
  }

  const updateMeasurements = (fields) => {
    setFormData(prev => ({
      ...prev,
      measurements: { ...prev.measurements, ...fields },
    }))
  }

  const updateAlterationMeasurements = (fields) => {
    setFormData(prev => ({
      ...prev,
      alterationMeasurements: { ...prev.alterationMeasurements, ...fields },
    }))
  }

  const saveProgress = async (step) => {
    try {
      await fetch("/api/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousSessionId,
          email: formData.email || null,
          currentStep: step,
          formData,
        }),
      })
    } catch {
      // Non-blocking
    }
  }

  const nextStep = async () => {
    const next = currentStep + 1
    await saveProgress(next)
    setCurrentStep(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const resetToStep = (step) => {
    setCurrentStep(step)
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setCurrentStep(1)
    setError(null)
  }

  return {
    currentStep,
    formData,
    updateFormData,
    updateMeasurements,
    updateAlterationMeasurements,
    nextStep,
    prevStep,
    resetToStep,
    resetForm,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    anonymousSessionId,
  }
}