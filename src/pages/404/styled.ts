import styled from "styled-components"

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  color: #0f172a;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
`

export const Navbar = styled.nav`
  width: 100%;
  height: 80px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
`

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
`

export const LogoText = styled.span`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(90deg, #1d4ed8, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`

export const Content = styled.div`
  max-width: 640px;
  width: 100%;
  text-align: center;
`

export const Illustration = styled.div`
  position: relative;
  margin-bottom: 32px;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.05);
  }
`

export const Code404 = styled.div`
  font-size: 120px;
  font-weight: 900;
  color: #e2e8f0;
  line-height: 1;
  letter-spacing: -0.06em;
  user-select: none;

  @media (min-width: 768px) {
    font-size: 180px;
  }
`

export const IconWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    background: #ffffff;
    padding: 24px;
    border-radius: 9999px;
    color: #2563eb;
    border: 1px solid #dbeafe;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    width: 48px;
    height: 48px;

    @media (min-width: 768px) {
      width: 64px;
      height: 64px;
    }
  }
`

export const TextBlock = styled.div`
  margin-bottom: 32px;
  padding: 0 16px;

  h1 {
    font-size: 30px;
    font-weight: 800;
    margin-bottom: 8px;
    letter-spacing: -0.03em;
    color: #0f172a;

    @media (min-width: 768px) {
      font-size: 48px;
    }
  }

  p {
    font-size: 16px;
    color: #64748b;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;

    @media (min-width: 768px) {
      font-size: 18px;
    }
  }
`

export const Card = styled.div`
  background: #ffffff;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
  margin: 0 auto 24px;
  max-width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  @media (min-width: 768px) {
    max-width: 420px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 28px 60px rgba(15, 23, 42, 0.1);
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1e293b;
  }

  p {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 24px;
    line-height: 1.5;
  }
`

export const WhatsappButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #22c55e;
  color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.25);
  transition: background 0.2s ease, transform 0.1s ease;

  &:hover {
    background: #16a34a;
  }

  &:active {
    transform: scale(0.97);
  }
`

export const BackButton = styled.button`
  margin-top: 32px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: color 0.2s ease, background 0.2s ease;

  &:hover {
    color: #2563eb;
    background: #eff6ff;
  }
`

export const Footer = styled.footer`
  padding: 32px 16px;
  text-align: center;
  color: #94a3b8;
  border-top: 1px solid #e2e8f0;
  font-size: 12px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`
