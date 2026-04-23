"use client"

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

/**
 * useFormState — manages the entire booking flow across all 6 steps.
 *
 * Steps 1–3 are anonymous. Progress lives only in React state.
 * At step 4, the customer enters their email. From that point,
 * every save operation uses their email as the persistent identifier.
 *
 * anonymousSessionId: a temporary UUID generated when the hook mounts.
 * Used to track analytics events for steps 1–3 before email is known.
 * It is never stored in localStorage — it lives only in memory.
 */

const initialFormData = {
  // Step 1
  service: '',

  // Step 2
  appointmentDate: '',
  appointmentTime: '',
  measurementType: '',   // "physical" | "self"

  // Step 3
  measurements: {
    chest: '',
    waist: '',
    hips: '',
    length: '',
    notes: ''
  },

  // Step 4 — email gate
  email: '',

  // Step 5
  name: '',
  phone: '',
  specialRequests: ''
}

export const useFormState = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Temporary anonymous ID — lives in memory only, never persisted
  // Used for analytics tracking before email is captured at step 4
  const [anonymousSessionId] = useState(() => uuidv4())

  // Updates top-level fields in formData without overwriting the whole object
  // Example: updateFormData({ service: 'custom_outfit' })
  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }))
  }

  // Updates nested fields inside the measurements object specifically
  // Example: updateMeasurements({ chest: '90cm', waist: '75cm' })
  const updateMeasurements = (fields) => {
    setFormData(prev => ({
      ...prev,
      measurements: { ...prev.measurements, ...fields }
    }))
  }

  // Saves progress to MongoDB via the session API.
  // Steps 1–3: saves using the anonymous session ID (no email yet)
  // Step 4+: saves using the customer's email as the identifier
  const saveProgress = async (step) => {
    try {
      await fetch('/api/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousSessionId,
          email: formData.email ?? null,
          currentStep: step,
          formData
        })
      })
    } catch (err) {
      // Non-blocking — do not prevent the user from advancing
      // if the save fails. Log it for debugging.
      console.error('Failed to save progress:', err)
    }
  }

  const nextStep = async () => {
    const next = currentStep + 1
    await saveProgress(next)
    setCurrentStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Resets the entire form back to its initial state after booking is confirmed
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
    nextStep,
    prevStep,
    resetForm,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    anonymousSessionId
  }
}