import styled from "styled-components"

export const Component = styled.aside<{ $inline?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 420px;
  position: ${({ $inline }) => ($inline ? "unset" : "absolute")};
  z-index: ${({ $inline }) => ($inline ? "unset" : "3")};
  top: ${({ $inline }) => ($inline ? "unset" : "24px")};
  right: ${({ $inline }) => ($inline ? "unset" : "0")};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.23);
  background-color: ${({ theme }) => theme.colors.white.main};
  flex: ${({ $inline }) => ($inline ? "0 0 auto" : "unset")};

  @media (max-width: ${({ theme }) => theme.bp.large}px) {
    max-width: ${({ $inline }) => ($inline ? "420px" : "calc((100% / 5) * 2)")};
  }

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    position: unset;
    z-index: unset;
    max-width: unset;
    flex: unset;
  }

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeBottom +
    theme.animations.durations.main +
    theme.animations.delays.main(1)}
`

export const Top = styled.div`
  background-color: ${({ theme }) => theme.colors.blue.darker};
  padding: 12px;
  color: ${({ theme }) => theme.colors.white.main};

  span {
    font-size: 20px;
    opacity: 0;
    ${({ theme }) =>
      theme.animations.types.fadeLeft +
      theme.animations.durations.main +
      theme.animations.delays.main(2)}
  }
`

export const DateArea = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px;
  position: relative;

  span {
    white-space: nowrap;
    opacity: 0;
    ${({ theme }) =>
      theme.animations.types.fadeLeft +
      theme.animations.durations.main +
      theme.animations.delays.main(2)}
  }

  & > div {
    opacity: 0;
    ${({ theme }) =>
      theme.animations.types.fadeLeft +
      theme.animations.durations.main +
      theme.animations.delays.main(3)}
  }
`

export const Tickets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  padding-top: 12px;
`

export const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 12px;
`

export const BottomFinal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 340px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
`

export const TaxesResume = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    opacity: 0;
    ${({ theme }) =>
      theme.animations.types.fadeLeft +
      theme.animations.durations.main +
      theme.animations.delays.main(2)}
  }
`

export const TaxResume = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  span {
    opacity: 0;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.blue.darker};
    ${({ theme }) =>
      theme.animations.types.fadeLeft +
      theme.animations.durations.main +
      theme.animations.delays.main(2)}

    &:nth-child(2) {
      width: 120px;
    }
  }
`

export const Resume = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    opacity: 0;
    ${({ theme }) =>
      theme.animations.types.fadeLeft +
      theme.animations.durations.main +
      theme.animations.delays.main(2)}
  }
`

export const Total = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.blue.darker};
`

export const Installments = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.blue.darker};
  opacity: 0.5;
`

export const BuyBtn = styled.button`
  cursor: pointer;
  background: ${({ theme }) => theme.colors.green.main};
  border: none;
  outline: none;
  padding: 0.6rem 2.1rem;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white.main};
  font-weight: 500;
  transition: filter 0.3s;

  @media (max-width: 340px) {
    width: 100%;
  }

  &:disabled {
    filter: saturate(0);
  }

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fade +
    theme.animations.durations.main +
    theme.animations.delays.main(3)}
`

export const KeepOutSellsOnlineMessage = styled.span`
  margin: 24px;
  font-size: 16px;
  color: #2a2a2a;
  text-align: center;
`