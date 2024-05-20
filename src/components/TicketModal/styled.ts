import styled from "styled-components"
import { TTicketStatus } from "../../utils/@types/ticket"

export const Wrapper = styled.div`
  position: fixed;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  background: rgba(155, 155, 155, 0.6);
  backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: opacity 0.6s;
  opacity: 0;

  &.shown {
    opacity: 1;
  }

  &.visible {
    width: unset;
    height: unset;
  }
`

export const Component = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  padding: 24px 82px;
  border-radius: 8px;
  max-width: 520px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  background-color: #fff;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);

  svg {
    width: 360px;
    height: 360px;
  }

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    width: 100%;
    max-width: calc(100vw - 64px - 64px);
    margin: 0 64px;
    padding: 24px 48px;
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    height: fit-content;

    svg {
      width: 100%;
      height: auto;
      aspect-ratio: 1;
    }
  }

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    padding: 24px;
    max-width: calc(100vw - 64px - 24px);
  }
`

export const TicketTitle = styled.span`
  font-size: 32px;
  font-weight: bold;
  color: #222;

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    font-size: 24px;
  }
`

export const TicketStatus = styled.span<{ $status?: TTicketStatus }>`
  font-size: 28px;
  font-weight: bold;
  color: ${({ $status, theme }) =>
    $status === "purchased"
      ? theme.colors.green.light
      : $status === "validated"
      ? "#F33"
      : $status === "expired"
      ? theme.colors.orange.main
      : "transparent"};

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    font-size: 20px;
  }
`
