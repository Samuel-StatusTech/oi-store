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

export const PageTitle = styled.h1<{ $align?: string }>`
  font-size: 24px;
  font-weight: bold;
  text-align: ${({ $align }) => $align ?? "left"};
`

export const PageSubTitle = styled.h1<{ $align?: string }>`
  margin-top: -24px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black.secondary};
`

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 100%;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 840px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 580px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
