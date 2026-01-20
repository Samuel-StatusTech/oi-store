import React, { useEffect, useRef, useState } from "react"
import {
  Ticket,
  ArrowRight,
  Smartphone,
  Lock,
  Loader2,
  CheckCircle2,
  MessageCircle,
} from "lucide-react"

import * as S from "./styled"
import { Api } from "../../api"
import getStore from "../../store"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [, setFailedCODE] = useState(false)

  const store = getStore()
  const navigate = useNavigate()

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  /* ---------- ETAPA 0: CHECK EVENT ---------- */

  // useEffect(() => {
  //   if (step === 2) {
  //     otpInputRefs.current[0]?.focus()
  //   }
  // }, [step])

  /* ---------- ETAPA 1: TELEFONE ---------- */

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`
    }

    if (value.length > 9) {
      value = `${value.substring(0, 10)}-${value.substring(10)}`
    } else if (value.length > 7) {
      value = `${value.substring(0, 9)}-${value.substring(9)}`
    }

    setPhone(value)
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length < 15) return

    setIsLoading(true)

    try {
      const cleanPhone = phone.replace(/\D/g, "")

      const dk = store.event?.dk ?? ""

      if (cleanPhone.length === 11) {
        await Api.post.login
          .requestCode({
            phone: cleanPhone,
            dk: dk,
          })
          .then((res) => {
            if (res.ok) setStep(2)
            else {
              alert(res.error)
            }
          })
      } else alert("Digite um número válido")
    } catch (error) {}

    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 1500)
  }

  /* ---------- ETAPA 2: OTP ---------- */

  useEffect(() => {
    if (step === 2) {
      otpInputRefs.current[0]?.focus()
    }
  }, [step])

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }

    const combined = newOtp.join("")
    if (index === 5 && combined.length === 6) {
      handleLogin(combined)
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleLogin = async (code: string) => {
    setIsLoading(true)

    const dk = store.event?.dk ?? ""

    try {
      const login = await Api.post.login.validateCode({
        phone: phone.replace(/\D/g, ""),
        code,
        dk: dk,
      })

      if (login.ok) {
        store.controllers.user.setData(login.data)

        sessionStorage.setItem("user", JSON.stringify(login.data))
        navigate("/myTickets")
      } else {
        alert(
          "Código inválido. Verifique se o código e o telefone estão corretos e tente novamente.",
        )
        setFailedCODE(true)
      }
    } catch (error) {
      setFailedCODE(true)
    }

    setIsLoading(false)
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(otp.join(""))
  }

  return (
    <S.Container>
      <S.Wrapper>
        {/* ---------- HEADER ---------- */}
        <S.Header>
          <S.HeaderIcon>
            <Ticket size={32} color="#2563eb" />
          </S.HeaderIcon>

          <S.HeaderTitle>Fazer Login</S.HeaderTitle>
          <S.HeaderSubtitle>
            Entre com seu celular para acessar sua conta.
          </S.HeaderSubtitle>
        </S.Header>

        {/* ---------- CARD ---------- */}
        <S.Card>
          <S.ProgressBar>
            <S.Progress step={step} />
          </S.ProgressBar>

          {step === 1 ? (
            /* ---------- ETAPA 1 ---------- */
            <S.Form onSubmit={handleSendCode}>
              <S.Field>
                <S.Label>
                  <Smartphone size={16} color="#60a5fa" />
                  WhatsApp / Celular
                </S.Label>

                <S.InputWrapper>
                  <S.Input
                    type="tel"
                    autoComplete="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />

                  {phone.length === 15 && (
                    <S.InputCheckIcon>
                      <CheckCircle2 size={20} />
                    </S.InputCheckIcon>
                  )}
                </S.InputWrapper>

                <S.Hint>
                  <MessageCircle size={14} color="#3b82f6" />
                  <span>
                    Enviaremos o código de acesso pelo <strong>WhatsApp</strong>
                    .
                  </span>
                </S.Hint>
              </S.Field>

              <S.PrimaryButton
                type="submit"
                disabled={phone.length < 15 || isLoading}
              >
                {isLoading ? (
                  <S.Loader>
                    <Loader2 />
                  </S.Loader>
                ) : (
                  <>
                    Receber Código
                    <ArrowRight size={20} />
                  </>
                )}
              </S.PrimaryButton>
            </S.Form>
          ) : (
            /* ---------- ETAPA 2 ---------- */
            <S.Form onSubmit={handleVerifyCode}>
              <S.Step2Header>
                <S.Step2Icon>
                  <MessageCircle size={24} />
                </S.Step2Icon>

                <S.Step2Title>Verifique seu WhatsApp</S.Step2Title>
                <S.Step2Subtitle>
                  Enviamos o código para{" "}
                  <strong style={{ color: "#0f172a" }}>{phone}</strong>
                </S.Step2Subtitle>

                <S.EditPhoneButton type="button" onClick={() => setStep(1)}>
                  Número errado? Corrigir
                </S.EditPhoneButton>
              </S.Step2Header>

              <S.Field>
                <S.Label style={{ justifyContent: "center" }}>
                  <Lock size={16} color="#60a5fa" />
                  Digite o código de 6 dígitos
                </S.Label>

                <S.OtpGroup>
                  {otp.map((digit, index) => (
                    <S.OtpInput
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </S.OtpGroup>
              </S.Field>

              <S.PrimaryButton
                type="submit"
                disabled={otp.join("").length < 6 || isLoading}
              >
                {isLoading ? (
                  <>
                    <S.Loader>
                      <Loader2 />
                    </S.Loader>
                    Validando...
                  </>
                ) : (
                  <>
                    Entrar no Evento
                    <ArrowRight size={20} />
                  </>
                )}
              </S.PrimaryButton>

              <S.OtpFooter>
                <p>Não recebeu no WhatsApp?</p>
                <S.ResendButton type="button">Reenviar código</S.ResendButton>
              </S.OtpFooter>
            </S.Form>
          )}
        </S.Card>
      </S.Wrapper>
    </S.Container>
  )
}
