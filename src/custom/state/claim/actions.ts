import { createAction } from '@reduxjs/toolkit'

export enum ClaimStatus {
  DEFAULT = 'DEFAULT',
  ATTEMPTING = 'ATTEMPTING',
  SUBMITTED = 'SUBMITTED',
  CONFIRMED = 'CONFIRMED',
}

export type ClaimActions = {
  // account
  setInputAddress: (payload: string) => void
  setActiveClaimAccount: (payload: string) => void
  setActiveClaimAccountENS: (payload: string) => void

  // search
  setIsSearchUsed: (payload: boolean) => void

  // claiming
  setClaimStatus: (payload: ClaimStatus) => void
  setClaimedAmount: (payload: string) => void

  // investing
  setIsInvestFlowActive: (payload: boolean) => void
  setInvestFlowStep: (payload: number) => void
  initInvestFlowData: () => void
  updateInvestAmount: (payload: { index: number; amount: string }) => void
  updateInvestError: (payload: { index: number; error: string | undefined }) => void

  // claim row selection
  setSelected: (payload: number[]) => void
  setSelectedAll: (payload: boolean) => void
}

// accounts
export const setInputAddress = createAction<string>('claim/setInputAddress')
export const setActiveClaimAccount = createAction<string>('claim/setActiveClaimAccount')
export const setActiveClaimAccountENS = createAction<string>('claim/setActiveClaimAccountENS')

// search
export const setIsSearchUsed = createAction<boolean>('claim/setIsSearchUsed')

// claiming
export const setClaimedAmount = createAction<string>('claim/setClaimedAmount')
export const setClaimStatus = createAction<ClaimStatus>('claim/setClaimStatus')

// investing
export const setIsInvestFlowActive = createAction<boolean>('claim/setIsInvestFlowActive')
export const setInvestFlowStep = createAction<number>('claim/setInvestFlowStep')
export const initInvestFlowData = createAction('claim/initInvestFlowData')
export const updateInvestAmount = createAction<{
  index: number
  amount: string
}>('claim/updateInvestAmount')
export const updateInvestError = createAction<{
  index: number
  error: string | undefined
}>('claim/updateInvestError')
// claim row selection
export const setSelected = createAction<number[]>('claim/setSelected')
export const setSelectedAll = createAction<boolean>('claim/setSelectedAll')
// Claim UI reset sugar
export const resetClaimUi = createAction('claims/resetClaimUi')