import styled from "styled-components"

export const Component = styled.aside`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 0 12px 6px;
  border-bottom: 1px solid #ccc;
`

export const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

export const Quantity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    line-height: 100%;
    line-height: 24px;
  }
`

export const QntControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Control = styled.button`
  border: none;
  outline: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: none;

  img {
    width: 24px;
    height: 24px;
    border-radius: 24px;
  }
`
