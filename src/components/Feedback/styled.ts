import styled from "styled-components"

export const Wrapper = styled.div<{
  $visible: boolean
}>`
  position: fixed;
  top: 100px;
  z-index: 50;
  right: 0;
  left: 0;
  
  transform: translateY(${({ $visible }) => ($visible ? "50" : "0")}%);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: transform 0.3s, opacity 0.3s, background-color 0.3s;

  height: ${({ $visible }) => ($visible ? "fit-content" : 0)};
`

export const Box = styled.div<{
  $visible: boolean
  $color: "green" | "orange" | "red"
}>`
  max-width: 75vw;
  width: fit-content;
  margin: 0 auto;
  display: flex;
  padding: 6px 14px;
  border-radius: 24px;
  background-color: ${({ $color, theme }) =>
    $color === "green"
      ? theme.colors.green.main
      : $color === "orange"
      ? theme.colors.orange.main
      : "#D8484A"};
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.08);

  span {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.white.main};
    text-align: center;
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    padding: 6px 32px;

    margin: 0 auto;
  }
`
