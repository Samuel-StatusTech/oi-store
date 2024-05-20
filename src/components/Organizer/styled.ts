import styled from "styled-components"

export const Component = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1;
  max-width: 256px;

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    max-width: 100%;
    min-width: 100%;
  }
`

export const Image = styled.img`
  width: 100%;
  max-width: 154px;
  margin: auto;

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    max-width: 84px;
  }
`

export const Title = styled.h5`
  font-size: 18px;
  margin: 12px 0;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    white-space: unset;
  }
`

export const Description = styled.span`
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    white-space: unset;
  }
`
