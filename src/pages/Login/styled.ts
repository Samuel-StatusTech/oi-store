import styled, { keyframes } from "styled-components"
/* ---------- Animações ---------- */

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

/* ---------- Layout Base ---------- */

export const Container = styled.div`
  min-height: 100svh;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f8fafc, #eff6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #0f172a;
`

export const Wrapper = styled.div`
  width: 100%;
  max-width: 420px;
`

/* ---------- Header ---------- */

export const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`

export const HeaderIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.05);
  }
`

export const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
`

export const HeaderSubtitle = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: #64748b;
`

/* ---------- Card ---------- */

export const Card = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid #ffffff;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
  overflow: hidden;

  @media (min-width: 640px) {
    padding: 32px;
  }
`

export const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #f1f5f9;
`

export const Progress = styled.div<{ step: 1 | 2 }>`
  height: 100%;
  width: ${({ step }) => (step === 1 ? "50%" : "100%")};
  background: #3b82f6;
  transition: width 0.5s ease;
`

/* ---------- Forms ---------- */

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeIn} 0.3s ease;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 4px;
`

/* ---------- Input Telefone ---------- */

export const InputWrapper = styled.div`
  position: relative;
`

export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:hover {
    background: #ffffff;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`

export const InputCheckIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #2563eb;
`

/* ---------- Hint WhatsApp ---------- */

export const Hint = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #475569;
  background: rgba(219, 234, 254, 0.4);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(191, 219, 254, 0.6);
`

/* ---------- Botões ---------- */

export const PrimaryButton = styled.button`
  width: 100%;
  background: #0f172a;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  padding: 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #020617;
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.18);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background: #e2e8f0;
    color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }
`

export const Loader = styled.div`
  animation: ${spin} 1s linear infinite;
  display: flex;
`

/* ---------- Etapa 2 ---------- */

export const Step2Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

export const Step2Icon = styled.div`
  width: 48px;
  height: 48px;
  background: #eff6ff;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: #2563eb;
`

export const Step2Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`

export const Step2Subtitle = styled.p`
  margin-top: 4px;
  font-size: 14px;
  color: #64748b;
`

export const EditPhoneButton = styled.button`
  margin-top: 8px;
  background: none;
  border: none;
  font-size: 12px;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  padding: 8px;
`

/* ---------- OTP ---------- */

export const OtpGroup = styled.div`
  display: flex;
  gap: 4px;
  justify-content: space-between;

  @media (min-width: 640px) {
    gap: 8px;
  }
`

export const OtpInput = styled.input`
  width: 100%;
  height: 48px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  caret-color: #2563eb;

  @media (min-width: 640px) {
    height: 64px;
    font-size: 24px;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`

/* ---------- Footer OTP ---------- */

export const OtpFooter = styled.div`
  text-align: center;
  font-size: 14px;
  color: #64748b;
`

export const ResendButton = styled.button`
  margin-top: 4px;
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
  padding: 8px;

  &:hover {
    text-decoration: underline;
  }
`
