import styled from "styled-components"

export const Component = styled.div`
  display: flex;
  gap: 24px;
  flex: 1;
`

export const IconArea = styled.div`
  display: grid;
  place-items: center;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Title = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.black.secondary};
`

export const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const DLine = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
`
