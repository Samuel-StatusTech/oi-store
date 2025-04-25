import styled from "styled-components"

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Hero = styled.div`
  position: relative;
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeTop +
    theme.animations.durations.main +
    theme.animations.delays.main(0.5)}

  img.blured {
    width: 100vw;
    height: calc(100%);
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    z-index: -50;
    filter: blur(60px);
    opacity: 0;
    ${({ theme }) =>
      theme.animations.types.fade +
      theme.animations.durations.main +
      theme.animations.delays.main(0)}
  }
`

export const ImageContainer = styled.div`
  max-height: 540px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;

  img {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
  }
`

export const EventDataArea = styled.section`
  position: relative;
  display: flex;
  flex: 5;
  gap: 48px;

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    flex-direction: column;
    z-index: unset;
  }
`

export const MainData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: calc((100% / 5) * 3);

  @media (max-width: ${({ theme }) => theme.bp.large}px) {
    max-width: calc(((100% / 5) * 3) - 24px);
  }

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    max-width: 100%;
    width: 100%;
  }
`

export const EventName = styled.h1`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black.secondary};
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeRight +
    theme.animations.durations.main +
    theme.animations.delays.main(1)}

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    margin: 0;
    font-size: 28px;
  }
`

export const Blocks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 24px 0;

  &.additional {
    margin-top: -24px;
    padding-top: 0;
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    flex-direction: column;
  }
`

// Description
export const DescriptionWrapper = styled.div`
  background-color: #fafafa;
  padding: 48px 0;
`

export const DescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 5;
`

export const DescTitle = styled.h3`
  font-size: 32px;
  color: ${({ theme }) => theme.colors.black.secondary};
  padding: 0;
  margin: 32px 0 24px 0;
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeRight + theme.animations.durations.main}

  &:nth-child(1) {
    ${({ theme }) => theme.animations.delays.main(2)}
  }

  &:nth-child(2) {
    ${({ theme }) => theme.animations.delays.main(3)}
  }
`

export const DescTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 5;

  p {
    margin: 0;
    padding-right: 48px;
    max-width: calc(((100% / 5) * 3) - 48px);
    white-space: newline;
    margin-top: 6px;

    b,
    strong {
      font-weight: 500;
    }
  }
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeRight +
    theme.animations.durations.main +
    theme.animations.delays.main(4)}

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    p {
      max-width: 100%;
      padding-right: 0;
      text-align: justify;
    }
  }
`

export const DescText = styled.p<{ $bold?: boolean }>`
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeRight +
    theme.animations.durations.main +
    theme.animations.delays.main(3)}
`

export const DescSubText = styled.span`
  color: #6f6f6f;
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeRight +
    theme.animations.durations.main +
    theme.animations.delays.main(4)}
`

export const MapEvent = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 480px;
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeRight +
    theme.animations.durations.main +
    theme.animations.delays.main(4)}
`
