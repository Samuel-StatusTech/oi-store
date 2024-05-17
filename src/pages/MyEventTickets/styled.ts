import styled from "styled-components"

export const Page = styled.div`
  display: flex;
  flex-direction: column;
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
`
