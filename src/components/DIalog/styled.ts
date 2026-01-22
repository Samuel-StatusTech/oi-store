import styled, { keyframes } from "styled-components"

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
`

export const Dialog = styled.div`
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  text-align: center;
  position: relative;
  animation: ${fadeIn} 0.25s ease;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.18);
`

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;

  &:hover {
    color: #0f172a;
  }
`

export const IconWrapper = styled.div<{
  variant: "error" | "success" | "info"
}>`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ variant }) =>
    variant === "error"
      ? "#fee2e2"
      : variant === "success"
        ? "#dcfce7"
        : "#eff6ff"};

  color: ${({ variant }) =>
    variant === "error"
      ? "#dc2626"
      : variant === "success"
        ? "#16a34a"
        : "#2563eb"};
`

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`

export const Description = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
`

export const Actions = styled.div`
  margin-top: 24px;
`

export const PrimaryButton = styled.button`
  width: 100%;
  background: #0f172a;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  padding: 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
  transition: all 0.2s ease;

  &:hover {
    background: #020617;
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.18);
  }

  &:active {
    transform: scale(0.97);
  }
`
