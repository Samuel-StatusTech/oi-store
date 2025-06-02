import styled from "styled-components"

export const Wrapper = styled.header``

export const BurguerWrapper = styled.div<{
  $opened: boolean
  $type?: "primary" | "secondary"
}>`
  position: absolute;
  top: ${({ $type }) => (!$type || $type === "primary" ? 12 : 64)}px;
  left: -96px;
  transform: translateX(
    ${({ $opened }) => ($opened ? "calc(50% + 12px)" : "calc(100% - 12px)")}
  );
  transition: transform 0.3s;
  background-color: ${({ theme }) => theme.colors.white.main};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
  border-radius: 200px;
  padding: 8px;
  z-index: 2;
  display: none;
  place-items: center;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    display: grid;
  }
`

export const Component = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    position: relative;
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background-color: ${({ theme }) => theme.colors.white.main};
    border-radius: 8px;
  }
`

export const LogoArea = styled.div`
  width: fit-content;

  a {
    width: fit-content;
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    text-decoration: none;

    img {
      max-height: 100%;
      width: auto;
      max-width: 120px;
    }

    span {
      color: ${({ theme }) => theme.colors.black.secondary};
      text-transform: uppercase;
      font-size: 16px;
      font-weight: 700;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

export const UserArea = styled.div<{ $opened: boolean }>`
  display: flex;
  gap: 12px;
  transition: left 0.3s;

  .myTickets,
  .logout {
    display: block;
    height: fit-content;
    text-decoration: none;
    background-color: ${({ theme }) => theme.colors.blue.main};
    color: ${({ theme }) => theme.colors.white.main};
    text-transform: uppercase;
    font-size: 16px;
    font-weight: 500;
    padding: 0.6em 1.4em;
    border-radius: 32px;
    cursor: pointer;
    text-align: center;
  }

  .logout {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.blue.main};

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    height: calc(100vh + 30px);
    min-height: calc(100svh - 40px);
    padding: 20px;
    left: calc(100vw - ${({ $opened }) => ($opened ? "80vw" : "0vw")});
    width: calc(80vw - 40px);
    background-color: #fefefe;
    box-shadow: ${({ $opened }) =>
      $opened
        ? `0px 0px 40px 2px rgba(0, 0, 0, 0.2)`
        : `0px 0px 0px 0vw rgba(0, 0, 0, 0.0)`};
    border-radius: 8px;
    transition: left 0.3s;

    & > div.btns-wrapper {
      width: 100%;
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    .myTickets,
    .logout {
      font-size: 14px;
      line-height: 14px;
      padding: 0.6rem 0.8rem;
    }
  }

  @media (max-width: ${({ theme }) => theme.bp.xsmall}px) {
    margin-top: 14px;
    /* align-self: flex-end; */
  }
`
