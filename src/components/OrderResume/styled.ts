import styled from "styled-components"

export const Component = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
  min-width: 380px;

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    min-width: unset;
  }

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fade +
    theme.animations.durations.main +
    theme.animations.delays.main(0)}
`

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 2;
  overflow: hidden;
  display: flex;
  align-items: center;

  img {
    min-height: 100%;
    width: 100%;
  }

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fade +
    theme.animations.durations.main +
    theme.animations.delays.main()}
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px;
`

export const InfoWrapper = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => ($expanded ? 1 : 0)}fr;
  overflow: hidden;
  transition: grid-template-rows 0.6s;

  @media (min-width: ${({ theme }) => theme.bp.small + 1}px) {
    grid-template-rows: 1fr;
  }
`

export const InfoData = styled.div`
  min-height: 42px;
`

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const EventResume = styled.div<{ $expanded: boolean }>`
  display: flex;
  gap: 6px;
  flex-direction: column;
  border-bottom: 1px solid #ccc;
  padding: 0 0 12px;

  div:nth-child(1) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    svg {
      transition: transform 0.4s;
      transform: rotate(${({ $expanded }) => ($expanded ? -180 : 0)}deg);
      display: none;
    }
  }

  div:nth-child(2) {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    div:nth-child(1) {
      cursor: pointer;

      svg {
        display: unset;
      }
    }

    div:nth-child(2) {
      flex-direction: column;
      gap: 6px;
    }
  }
`

export const ResumeText = styled.span`
  font-weight: bold;
  font-size: 20px;

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeLeft +
    theme.animations.durations.main +
    theme.animations.delays.main(2)}
`

export const DateText = styled.span`
  font-weight: bold;
  font-size: 20px;
  white-space: nowrap;
  text-transform: uppercase;
  white-space: pre-line;

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeLeft + theme.animations.durations.main}

  &:nth-child(2) {
    text-align: right;
    ${({ theme }) => theme.animations.delays.main(3)}
  }

  &:nth-child(2) {
    padding: 0 0 0 20px;
    flex: 1;
    text-align: right;
    ${({ theme }) => theme.animations.delays.main(4)}
  }
`

export const TicketsList = styled.div``

export const Total = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const TotalItem = styled.div<{ $main?: boolean }>`
  font-weight: ${({ $main }) => ($main ? "800" : "normal")};
  font-size: ${({ $main }) => ($main ? "24px" : "16px")};
  display: flex;

  span {
    flex: 1;
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    span:nth-child(1) {
      flex: 3;
    }

    span:nth-child(2) {
      flex: 2;
    }
  }

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeTop + theme.animations.durations.main}

  &:nth-child(1) {
    ${({ theme }) => theme.animations.delays.main(5)}
  }

  &:nth-child(2) {
    ${({ theme }) => theme.animations.delays.main(6)}
  }

  &:nth-child(3) {
    ${({ theme }) => theme.animations.delays.main(7)}
  }
`

export const ReleaseBlock = styled.div`
  display: flex;
  background-color: #222;
  padding: 24px;
  color: #fff;
  gap: 24px;

  @media (max-width: 380px) {
    flex-direction: column;
  }
`

export const RLeft = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 24px;
    aspectratio: 1;
  }

  span {
    font-size: 24px;
    font-weight: bold;
  }

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeLeft +
    theme.animations.durations.main +
    theme.animations.delays.main(2)}
`

export const RRight = styled.div`
  flex: 3;
  font-size: 14px;
  padding-left: 24px;
  border-left: 4px solid #888;

  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeLeft +
    theme.animations.durations.main +
    theme.animations.delays.main(3)}

  @media (max-width: 380px) {
    border-left: none;
    padding-left: 36px;
  }
`
