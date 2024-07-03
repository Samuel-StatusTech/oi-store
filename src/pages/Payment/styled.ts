import styled from "styled-components"

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
`

export const Main = styled.div`
  display: flex;
  gap: 24px;
  margin: 24px 0;
  padding: 0 0 64px 0;

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    flex-direction: column-reverse;
  }
`

export const EventResume = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 3;
`

export const EventData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 4px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border-radius: 12px;
`

export const EventName = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #000;
`

export const PaymentData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 4px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border-radius: 12px;

  span {
    font-size: 24px;
    font-weight: bold;
    color: #000;
  }
`

export const Methods = styled.div`
  display: flex;
  gap: 48px;
`

// Method

export const Method = styled.div<{ $checked: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  gap: 24px;
  width: 100%;
  max-width: 300px;
  // flex: 1;
  border: 1px solid
    ${({ $checked, theme }) => ($checked ? theme.colors.blue.main : "#ccc")};
  border-radius: 6px;
  padding: 24px 24px 32px;
  cursor: pointer;
  transition: border-color 0.3s;
  overflow: hidden;
`

export const MTitle = styled.div``

export const List = styled.div`
  display: flex;
  gap: 12px;
  max-width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

export const CardItem = styled.a`
  z-index: 1;
  position: relative;
`

export const Recommended = styled.div<{ $visible?: boolean }>`
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  background-color: #111;
  color: #fff;
  text-align: center;
  padding: 0px;
  z-index: 2;
`

export const OrderResume = styled.div`
  width: 320px;
`

// Form

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 46px;
  box-shadow: 0 2px 4px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border-radius: 12px;
`

export const FormBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;

  & > span {
    font-size: 24px;
    font-weight: bold;
    color: #000;
  }
`

export const FormLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`

export const FormLine = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    flex-direction: column;
  }
`

export const Label = styled.label`
  position: relative;
  max-width: 100%;
  flex: 1;

  & > span {
    position: absolute;
    left: 6px;
    top: 4px;
    font-size: 16px;
    transition: transform 0.3s, font-size 0.3s;
    color: #bbb;
  }

  &:has(input:focus) span,
  &:has(input:not(:placeholder-shown)) span {
    transform: translateY(-24px);
    font-size: 14px;
  }
`

export const Input = styled.input`
  border: 1px solid #ccc;
  outline: none;
  padding: 6px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black.secondary};
  border-radius: 4px;
  width: 100%;
  transition: border-color 0.3s;

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.blue.main};
  }
`

export const Checkbox = styled.label`
  cursor: pointer;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 4px;

  input {
    transform: translateY(2px);
  }

  &:has(.terms) {
    align-items: flex-start;
  }

  div.terms {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;

    span,
    a {
      white-space: nowrap;
    }

    a {
      color: ${({ theme }) => theme.colors.blue.main};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

export const TicketBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const TicketName = styled.div``

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
