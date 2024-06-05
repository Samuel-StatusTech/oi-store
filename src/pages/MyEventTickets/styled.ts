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

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
`

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 100%;

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
