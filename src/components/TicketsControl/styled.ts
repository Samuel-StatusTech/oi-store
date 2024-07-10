import styled from "styled-components"

export const Component = styled.aside`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 420px;
  position: absolute;
  z-index: 3;
  top: 24px;
  right: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.23);
  background-color: ${({ theme }) => theme.colors.white.main};

  @media (max-width: ${({ theme }) => theme.bp.large}px) {
    max-width: calc((100% / 5) * 2);
  }

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    position: unset;
    z-index: unset;
    max-width: unset;
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
  justify-content: space-between;
  align-items: center;
  padding: 12px;

  @media (max-width: 340px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
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
  padding: 0.6rem 1.4rem;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white.main};
  font-weight: 500;

  @media (max-width: 340px) {
    width: 100%;
  }

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fade +
    theme.animations.durations.main +
    theme.animations.delays.main(3)}
`
