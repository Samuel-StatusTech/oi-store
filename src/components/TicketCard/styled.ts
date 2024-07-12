import styled from "styled-components"

export const Component = styled.div<{ $k: number }>`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);

  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    width: 100%;
  }

  &:hover {
    box-shadow: 0 0 16px 4px rgba(0, 0, 0, 0.18);
  }

  &:hover .iconsArea {
    opacity: 1;
  }

  opacity: 0;
  ${({ $k, theme }) =>
    theme.animations.types.fadeLeft +
    theme.animations.durations.main +
    theme.animations.delays.main($k)}
`

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 2;
  overflow: hidden;
  display: flex;
  align-items: center;

  img {
    min-height: 100%;
    max-width: 100%;
  }
`

export const EventInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  padding: 12px;
`

export const EventName = styled.span`
  font-size: 20px;
  color: #222;
  font-weight: bold;
`

export const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:nth-child(1) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const Icons = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s;

  div {
    background: none;
    border: none;
    outline: none;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.3s;
    cursor: pointer;
    width: fit-content;
    min-width: 42px;
    min-height: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    svg {
      width: 24px;
      height: 24px;
    }

    span {
      font-size: 11px;
      color: ${({ theme }) => theme.colors.blue.main};
    }

    &:hover {
      background-color: #eee;
    }
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    opacity: 1;

    button {
      opacity: 1;
    }
  }
`

export const EventDate = styled.span`
  font-size: 14px;
  color: #bbb;
  white-space: nowrap;
`

export const TicketsQnt = styled.span`
  font-size: 14px;
  color: #222;
`
