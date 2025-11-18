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
  $color: "green" | "orange" | "red" | "blue"
}>`
  max-width: 75vw;
  width: fit-content;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 16px 28px;
  border-radius: 12px;
  background-color: ${({ $color, theme }) =>
    $color === "green"
      ? theme.colors.green.main
      : $color === "orange"
      ? theme.colors.orange.main
      : $color === "blue"
      ? "rgb(22, 66, 119)"
      : "#D8484A"};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  span {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.white.main};
    text-align: left;
    white-space: pre-line;
    line-height: 1.8;
    display: block;
    width: 100%;
    font-weight: 500;
  }

  @media (min-width: ${({ theme }) => `${theme.bp.small + 1}px`}) {
    padding: 20px 40px;
    max-width: 600px;
    
    span {
      font-size: 18px;
      line-height: 1.8;
    }
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    padding: 6px 32px;

    margin: 0 auto;
  }
`
