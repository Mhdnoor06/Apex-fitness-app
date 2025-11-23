

import { api } from "./client"
import type { OnboardingRequest, OnboardingResponse } from "./types"

const ONBOARDING_ENDPOINTS = {
  save: "/api/onboarding",
} as const

export const onboardingService = {
  
  saveOnboarding: async (data: OnboardingRequest): Promise<OnboardingResponse> => {
    return api.post<OnboardingResponse>(ONBOARDING_ENDPOINTS.save, data)
  },
}

