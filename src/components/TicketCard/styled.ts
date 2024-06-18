import styled from "styled-components"

export const Component = styled.div`
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);

  a {
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
`

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 2;
  overflow: hidden;

  img {
    max-width: 100%;
  }
`

export const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
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

  button {
    background: none;
    border: none;
    outline: none;
    padding: 4px;
    border-radius: 2px;
    transition: background-color 0.3s;
    cursor: pointer;

    &:hover {
      background-color: #eee;
    }
  }
`

export const EventDate = styled.span`
  font-size: 14px;
  color: #bbb;
`

export const TicketsQnt = styled.span`
  font-size: 14px;
  color: #222;
`
