import styled from "styled-components"

export const Wrapper = styled.header``

export const Component = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    flex-direction: column;
  }
`

export const LogoArea = styled.div`
  width: fit-content;

  a {
    width: fit-content;
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    text-decoration: none;

    img {
      width: 120px;
    }

    span {
      color: ${({ theme }) => theme.colors.black.secondary};
      text-transform: uppercase;
      font-size: 16px;
      font-weight: 700;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    a img {
      width: 120px;
      height: auto;
    }
  }
`

export const UserArea = styled.div`
  display: flex;
  gap: 12px;

  .myTickets,
  .logout {
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
    text-align: center;
  }

  .logout {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.blue.main};

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    .myTickets,
    .logout {
      font-size: 14px;
      line-height: 14px;
      padding: 0.6rem 0.8rem;
    }
  }

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    margin-top: 14px;
    align-self: flex-end;
  }
`
