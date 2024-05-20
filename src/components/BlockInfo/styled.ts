import styled from "styled-components"

export const Component = styled.div`
  display: flex;
  gap: 24px;
  flex: 1;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    flex-direction: column;
    gap: 12px;
  }
`

export const IconArea = styled.div`
  display: grid;
  place-items: center;

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    img {
      width: 48px;
      height: 48px;
    }
  }
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

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    gap: 0;
  }
`

export const DLine = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  // white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    white-space: unset;
  }
`
