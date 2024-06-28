import styled from "styled-components"

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Hero = styled.div`
  position: relative;

  img {
    max-width: 100%;
  }

  img:not(.blured) {
    border-radius: 12px;
  }

  img.blured {
    width: 100vw;
    height: calc(100%);
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    z-index: -50;
    filter: blur(60px);
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

  @media (max-width: ${({ theme }) => theme.bp.medium}px) {
    p {
      max-width: 100%;
      padding-right: 0;
      text-align: justify;
    }
  }
`

export const DescText = styled.p<{ $bold?: boolean }>``

export const DescSubText = styled.span`
  color: ${({ theme }) => theme.colors.black.secondary};
  opacity: 0.5;
`

// Organizers
export const Organizers = styled.div`
  display: flex;
  gap: 64px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    img {
      width: 100%;
      height: auto;
    }
  }
`
