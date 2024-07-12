import styled from "styled-components"

export const Box = styled.div<{
  $visible: boolean
  $color: "green" | "orange" | "red"
}>`
  position: fixed;
  z-index: 50;
  top: 100px;
  left: 50%;
  display: flex;
  padding: 6px 10px;
  border-radius: 24px;
  background-color: ${({ $color, theme }) =>
    $color === "green"
      ? theme.colors.green.main
      : $color === "orange"
      ? theme.colors.orange.main
      : "#D8484A"};
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.08);
  transform: translate(-50%, ${({ $visible }) => ($visible ? "50" : "0")}%);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: transform 0.3s, opacity 0.3s, background-color 0.3s;

  span {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.white.main};
    text-align: center;
    white-space: nowrap;
  }

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    padding: 6px 32px;

    span {
      white-space: pre-line;
    }
  }
`
