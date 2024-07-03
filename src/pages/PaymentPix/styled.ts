import styled from "styled-components"

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
`

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 0 64px 0;
`

export const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 2px 4px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border-radius: 12px;
`

export const EventInfo = styled.div`
  display: flex;
  gap: 24px;

  img {
    max-width: 420px;
    border-radius: 12px;
  }

  & > div.eventInfos {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    height: fit-content;
  }

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    flex-direction: column;

    img {
      max-width: 100%;
    }
  }
`

export const BlockTitle = styled.span`
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
  flex: 1;
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

export const PixArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`

export const PixInstructions = styled.div`
  text-align: center;
  color: #999;
  max-width: 300px;
`

export const QR = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  max-width: 280px;

  img,
  svg {
    max-width: 100%;
    width: 256px;
    height: 256px;
  }
`

export const PixTime = styled.div`
  display: flex;
  gap: 4px;

  span {
    white-space: pre-line;
    color: #999;
  }

  strong {
    color: ${({ theme }) => theme.colors.black.secondary};
    font-weight: bold;
  }

  @media (max-width: 480px) {
    text-align: center;
  }
`

export const Button = styled.button`
  outline: none;
  background-color: ${({ theme }) => theme.colors.blue.main};
  border: none;
  cursor: pointer;
  padding: 0.6rem 1.4rem;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  width: 100%;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.24);
  }
`
