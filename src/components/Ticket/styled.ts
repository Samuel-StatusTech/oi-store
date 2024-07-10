import styled from "styled-components"

export const Component = styled.div<{ $k?: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 0 12px 6px;
  border-bottom: 1px solid #ccc;

  @media (max-width: 340px) {
    flex-direction: column;
    padding-bottom: 24px;
  }

  opacity: 0;
  ${({ $k, theme }) =>
    theme.animations.types.fadeLeft +
    theme.animations.durations.main +
    theme.animations.delays.main($k)}
`

export const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 340px) {
    align-self: flex-start;
  }
`

export const TicketName = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.black.secondary};
`

export const TicketPrice = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black.secondary};
  opacity: 0.5;
`

export const Quantity = styled.div<{ $saledOut?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${({ $saledOut }) =>
    $saledOut ? "width: 100%; max-width: 120px; text-align: center;" : ""}

  span {
    line-height: 100%;
    line-height: 24px;
  }
`

export const QntControl = styled.div`
  display: flex;
  align-items: center;

  span {
    min-width: 32px;
    text-align: center;
    margin: 0 8px;
  }
`

export const Control = styled.button<{ $disabled?: boolean }>`
  border: none;
  outline: none;
  display: grid;
  place-items: center;
  cursor: ${({ $disabled }) => ($disabled ? "unset" : "pointer")};
  background: none;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: opacity 0.3s;

  img {
    width: 24px;
    height: 24px;
    border-radius: 24px;
  }
`
