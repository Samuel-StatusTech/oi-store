import styled from "styled-components"

export const Wrapper = styled.header``

export const Component = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 24px 0;
`

export const LogoArea = styled.div`
  width: fit-content;
  a {
    width: fit-content;

    img {
      width: auto;
      height: 40px;
    }
  }
`

export const UserArea = styled.div`
  display: flex;
  gap: 12px;

  .myTickets {
    display: block;
    height: fit-content;
    text-decoration: none;
    background-color: ${({ theme }) => theme.colors.blue.main};
    color: ${({ theme }) => theme.colors.white.main};
    text-transform: uppercase;
    font-size: 16px;
    font-weight: 500;
    padding: 0.6em 1.4em;
    border-radius: 32px;
    cursor: pointer;
  }
`
