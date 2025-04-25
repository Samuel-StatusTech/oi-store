import styled from "styled-components"

export const Component = styled.div<{ $k?: number }>`
  display: flex;
  gap: 24px;
  flex: 1;
  align-items: flex-start;
  opacity: ${({ theme, $k }) => ($k ? 0 : 1)};
  ${({ theme, $k }) =>
    $k
      ? theme.animations.types.fadeRight +
        theme.animations.durations.main +
        theme.animations.delays.main($k)
      : ""}

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    flex-direction: column;
    gap: 12px;
  }
`

export const IconArea = styled.div`
  display: grid;
  place-items: center;

  &:has(img) {
    background-color: #E5E4ED;
    border-radius: 8px;
    min-width: 84px;
    height: 84px;
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    img {
      width: 48px;
      height: 48px;

      &.userSafety {
        width: 24px;
        height: 24px;
      }
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
