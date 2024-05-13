import styled from "styled-components"

export const Component = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.blue.darker};
`

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  gap: 48px;

  img {
    max-width: 124px;
    margin: auto;
  }
`

export const ColsArea = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 64px;
`

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px
`

export const ColTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.blue.main};
`

export const ColContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  a {
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.white.main};

    &:hover {
      text-decoration: underline;
    }
  }
`

export const CopyArea = styled.div`
  display: flex;
  justify-content: center;
  background-color: rgb(42, 42, 42);
  padding: 6px 0;
  gap: 4px;
`

export const CopyItem = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.white.main};
`
