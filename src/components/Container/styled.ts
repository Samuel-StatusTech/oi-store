import styled from "styled-components"

export const Component = styled.div<{ $fullHeight?: boolean }>`
  width: 100%;
  max-width: 1180px;
  margin: auto;
  flex: ${({ $fullHeight }) => ($fullHeight ? 1 : "unset")};

  @media (max-width: 1240px) {
    max-width: calc(100% - (2 * 64px));
  }

  @media (max-width: 920px) {
    max-width: calc(100% - (2 * 48px));
  }

  @media (max-width: 520px) {
    max-width: calc(100% - (2 * 24px));
  }
`
