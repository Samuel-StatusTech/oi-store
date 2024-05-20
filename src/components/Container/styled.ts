import styled from "styled-components"

export const Component = styled.div`
  width: 100%;
  max-width: 1180px;
  margin: auto;

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
