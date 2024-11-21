import styled from "styled-components"

export const Button = styled.button<{ $disabled: boolean }>`
  outline: none;
  background-color: ${({ $disabled, theme }) =>
    !$disabled ? theme.colors.blue.main : "#CCC"};
  border: none;
  cursor: pointer;
  padding: 0.6rem 1.4rem;
  border-radius: 4px;
  color: #fff;
  width: fit-content;
  align-self: flex-end;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.24);
  }
`
