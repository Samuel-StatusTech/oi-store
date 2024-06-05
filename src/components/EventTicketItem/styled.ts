import styled from "styled-components"
import { TTicketStatus } from "../../utils/@types/data/ticket"

export const Component = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 16px 4px rgba(0, 0, 0, 0.18);
  }

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    
    svg {
      width: 98px;
      height: 98px;
    }
  }

  @media (max-width: 420px) {
    
    svg {
      width: 128px;
      height: 128px;
    }
  }
`

export const TicketTitle = styled.span`
  color: #222;
`

export const TicketStatus = styled.span<{ $status: TTicketStatus }>`
  color: ${({ $status, theme }) =>
    $status === "purchased"
      ? theme.colors.green.light
      : $status === "validated"
      ? "#F33"
      : $status === "expired"
      ? theme.colors.orange.main
      : "transparent"};
`
