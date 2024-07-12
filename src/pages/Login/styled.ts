import styled from "styled-components"

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  height: 100vh;
`

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 360px;
  height: fit-content;
  overflow: hidden;
  max-height: 180px;
  margin: -140px 24px 0;

  img {
    width: 100%;
    opacity: 0;
    object-fit: cover;
    ${({ theme }) =>
      theme.animations.types.fadeTop +
      theme.animations.durations.main +
      theme.animations.delays.main()}
  }

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    max-width: calc(100% - 48px);
    width: 100%;
  }
`

export const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.14);
  max-width: 360px;
  width: 100%;
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeTop +
    theme.animations.durations.main +
    theme.animations.delays.main()}
  height: fit-content;
  transition: height 0.3s;

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    box-shadow: unset;
    margin: 24px;
    border: 2px solid rgb(200, 200, 200, 0.5);
    max-width: calc(100% - 48px);
    box-sizing: border-box;
  }
`

export const FormTitle = styled.h1`
  text-align: center;
  // color: ${({ theme }) => theme.colors.blue.main};
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeRight +
    theme.animations.durations.main +
    theme.animations.delays.main(2)}
`

export const Phases = styled.div`
  max-width: 360px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 48px;

  @media (max-width: ${({ theme }) => theme.bp.small}px) {
    max-width: 100%;
    box-sizing: border-box;
  }
`

export const Phase = styled.div<{
  $changing?: boolean
  $phase?: "phone" | "code"
}>`
  min-width: 100%;
  opacity: ${({ $changing }) => ($changing ? 0 : 1)};
  transition: opacity 0.2s, margin-left 0.8s, height 0.3s;
  display: flex;
  flex-direction: column;
  height: fit-content;

  &:nth-child(1) {
    margin-left: ${({ $phase }) =>
      $phase === "code" ? "calc(-100% - 48px)" : ""};
  }
`

export const Inputs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const MessageArea = styled.div`
  position: relative;
  display: grid;
  place-items: center;
`

export const Message = styled.span<{ $error?: boolean; $failed: boolean }>`
  display: inline-block;
  font-size: 14px;
  text-align: center;
  color: ${({ $failed, theme }) => ($failed ? "red" : theme.colors.blue.main)};
  transition: background-color 0.3s, height 0.3s, opacity 0.2s;
  margin-bottom: 48px;
  height: auto;
  opacity: ${({ $error, $failed }) =>
    $error ? ($failed ? 1 : 0) : $failed ? 0 : 1};

  position: ${({ $error }) => ($error ? "absolute" : "relative")};
  ${({ $error }) =>
    $error ? "top: 50%; left: 50%; transform: translate(-50%, -100%);" : ""}
`

export const Label = styled.label<{ $k?: number }>`
  position: relative;
  max-width: 100%;
  opacity: 0;
  ${({ theme, $k }) =>
    theme.animations.types.fadeRight +
    theme.animations.durations.main +
    theme.animations.delays.main($k)}

  span {
    position: absolute;
    left: 6px;
    top: 10px;
    font-size: 16px;
    transition: transform 0.3s, font-size 0.3s;
    color: rgb(150, 150, 150);
  }

  input:focus + span,
  input:not(:placeholder-shown) + span {
    transform: translateY(-34px);
    font-size: 14px;
  }
`

export const CodeArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;

  & > label > span {
    font-weight: 600;
  }
`

export const MultipleInputs = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
`

export const Input = styled.input<{ $small?: boolean }>`
  border: 1px solid #ccc;
  outline: none;
  padding: 12px 6px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black.secondary};
  border-radius: 4px;
  width: 100%;
  transition: border-color 0.3s;
  box-sizing: border-box;
  text-align: ${({ $small }) => ($small ? "center" : "left")};

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.blue.main};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

export const Button = styled.button`
  border-radius: 4px;
  padding: 1rem 2.4rem;
  width: fit-content;
  margin: auto;
  cursor: pointer;
  outline: none;
  border: none;
  background-color: ${({ theme }) => theme.colors.blue.main};
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0);
  transition: opacity 0.3s, box-shadow 0.3s, background-color 0.3s,
    background-color 0.3s, filter 0.3s;
  color: #fff;
  font-size: 16px;
  opacity: 0;
  ${({ theme }) =>
    theme.animations.types.fadeRight +
    theme.animations.durations.main +
    theme.animations.delays.main(5)}

  &:hover {
    background-color: #003bdc;
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.24);
  }

  &:disabled {
    filter: saturate(0);
    cursor: unset;
  }
`
