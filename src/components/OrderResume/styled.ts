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
`

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 2;
  overflow: hidden;

  img {
    width: 100%;
  }
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0px 24px 24px;
`

export const EventResume = styled.div`
  display: flex;
  gap: 6px;
  flex-direction: column;
  border-bottom: 1px solid #ccc;
  padding: 0 0 12px;
`

export const ResumeText = styled.span`
  font-weight: bold;
  font-size: 20px;
`

export const DateText = styled.span`
  font-weight: bold;
  font-size: 20px;
  flex: 1;
  white-space: nowrap;
  text-transform: uppercase;
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
`

export const ReleaseBlock = styled.div`
  display: flex;
  background-color: #222;
  padding: 24px;
  color: #fff;
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
`

export const RRight = styled.div`
  flex: 3;
  font-size: 14px;
  padding-left: 24px;
  border-left: 4px solid #888;
`