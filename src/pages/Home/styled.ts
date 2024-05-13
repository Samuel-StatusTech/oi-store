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
`

export const MainData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const EventName = styled.h1`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black.secondary};
`

export const Blocks = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px 0;
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
  flex: 5;
`

export const DescText = styled.div<{ $bold?: boolean }>`
  padding-right: 48px;
  max-width: calc((100% / 5) * 3);
  white-space: newline;
  font-weight: ${({ $bold }) => ($bold ? 500 : "normal")};
  margin-top: 6px;
`

export const DescSubText = styled.span`
  color: ${({ theme }) => theme.colors.black.secondary};
  opacity: 0.5;
`

// Organizers
export const Organizers = styled.div`
  display: flex;
  gap: 64px;
  flex-wrap: wrap;
`
