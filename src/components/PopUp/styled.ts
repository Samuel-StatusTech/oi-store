import { red } from "@mui/material/colors"
import styled from "styled-components"

export const Area = styled.div<{ $showing: boolean }>`
  display: ${({ $showing }) => ($showing ? "flex" : "none")};
  flex-direction: column;
  gap: 24px;
  position: fixed;
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.25);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.white.main};

  width: 240px;
  //   width: 100%;
  //   max-width: calc(1180px - 248px);
  margin: auto;

  @media (max-width: 1240px) {
    max-width: calc(100% - (2 * 64px));
  }

  @media (max-width: 920px) {
    max-width: calc(100% - (2 * 48px));
  }

  @media (max-width: 520px) {
    max-width: calc(100% - (2 * 24px));
  }

  hr {
    width: 100%;
    border-color: ${({ theme }) => theme.colors.black.secondary};
    opacity: 0.2;
  }
`

export const Title = styled.h3`
  font-size: 26px;
  color: ${({ theme }) => theme.colors.black.secondary};
  text-align: center;
`

export const TicketsArea = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 36px;
`

export const TicketCard = styled.div`
  max-width: 240px;
  width: 100%;
`

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 24px;
`

export const Button = styled.button<{ $color: "red" | "yellow" | "blue" }>`
  outline: none;
  background-color: ${({ $color, theme }) =>
    $color === "red"
      ? red[700]
      : $color === "yellow"
      ? theme.colors.orange.main
      : theme.colors.blue.main};
  border: none;
  cursor: pointer;
  padding: 0.6rem 1.4rem;
  border-radius: 4px;
  color: #fff;
  width: 100%;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.24);
  }
`
