import { Trans } from '@lingui/macro'
import { isAddress } from '@ethersproject/address'
import { useClaimDispatchers, useClaimState, useHasClaimInvestmentFlowError } from 'state/claim/hooks'
import { ButtonPrimary, ButtonSecondary } from 'components/Button'
import { ClaimStatus } from 'state/claim/actions'
import { FooterNavButtons as FooterNavButtonsWrapper, ReadMoreText } from './styled'
import { useActiveWeb3React } from 'hooks/web3'
import { ClaimsTableProps } from './ClaimsTable'
import { ClaimAddressProps } from './ClaimAddress'
import { ReactNode } from 'react'
import { ExternalLink } from 'theme/index'
import { COW_LINKS } from '.'

type FooterNavButtonsProps = Pick<ClaimsTableProps, 'hasClaims' | 'isAirdropOnly'> &
  Pick<ClaimAddressProps, 'toggleWalletModal'> & {
    isPaidClaimsOnly: boolean
    resolvedAddress: string | null
    handleSubmitClaim: () => void
    handleCheckClaim: () => void
  }

function ReadMore() {
  return (
    <ReadMoreText>
      <ExternalLink href={COW_LINKS.vCowPost}>Read more about vCOW</ExternalLink>
    </ReadMoreText>
  )
}

export default function FooterNavButtons({
  hasClaims,
  isAirdropOnly,
  isPaidClaimsOnly,
  resolvedAddress,
  toggleWalletModal,
  handleSubmitClaim,
  handleCheckClaim,
}: FooterNavButtonsProps) {
  const { account } = useActiveWeb3React()
  const {
    // account
    activeClaimAccount,
    // claiming
    claimStatus,
    // investment
    investFlowStep,
    isInvestFlowActive,
    // table select change
    selected,
  } = useClaimState()

  const {
    // investing
    setInvestFlowStep,
    setIsInvestFlowActive,
  } = useClaimDispatchers()

  const hasError = useHasClaimInvestmentFlowError()

  const isInputAddressValid = isAddress(resolvedAddress || '')

  // User is connected and has some unclaimed claims
  const isConnectedAndHasClaims = !!activeClaimAccount && !!hasClaims && claimStatus === ClaimStatus.DEFAULT
  const noPaidClaimsSelected = !selected.length

  let buttonContent: ReactNode = null
  // Disconnected, show wallet connect
  if (!account) {
    buttonContent = (
      <ButtonPrimary onClick={toggleWalletModal}>
        <Trans>Connect a wallet</Trans>
      </ButtonPrimary>
    )
  }

  // User has no set active claim account and/or has claims, show claim account search
  if ((!activeClaimAccount || !hasClaims) && claimStatus === ClaimStatus.DEFAULT) {
    buttonContent = (
      <>
        <ButtonPrimary disabled={!isInputAddressValid} type="text" onClick={handleCheckClaim}>
          <Trans>Check claimable vCOW</Trans>
        </ButtonPrimary>
        <ReadMore />
      </>
    )
  }

  // USER is CONNECTED + HAS SOMETHING TO CLAIM
  if (isConnectedAndHasClaims) {
    if (!isInvestFlowActive) {
      buttonContent = (
        <>
          <ButtonPrimary onClick={handleSubmitClaim} disabled={isPaidClaimsOnly && noPaidClaimsSelected}>
            <Trans>Claim vCOW</Trans>
          </ButtonPrimary>
          <ReadMore />
        </>
      )
    } else if (!isAirdropOnly) {
      buttonContent = (
        <>
          {investFlowStep === 0 ? (
            <ButtonPrimary onClick={() => setInvestFlowStep(1)}>
              <Trans>Continue</Trans>
            </ButtonPrimary>
          ) : investFlowStep === 1 ? (
            <ButtonPrimary onClick={() => setInvestFlowStep(2)} disabled={hasError}>
              <Trans>Review</Trans>
            </ButtonPrimary>
          ) : (
            <ButtonPrimary onClick={handleSubmitClaim}>
              <Trans>Claim and invest vCOW</Trans>
            </ButtonPrimary>
          )}

          <ButtonSecondary
            onClick={() =>
              investFlowStep === 0 ? setIsInvestFlowActive(false) : setInvestFlowStep(investFlowStep - 1)
            }
          >
            <Trans>Go back</Trans>
          </ButtonSecondary>
        </>
      )
    }
  }

  return <FooterNavButtonsWrapper>{buttonContent}</FooterNavButtonsWrapper>
}