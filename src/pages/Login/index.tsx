/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import * as S from "./styled"
import { useLocation, useNavigate } from "react-router-dom"
import { formatPhone } from "../../utils/masks/phone"
import getStore from "../../store"
import { Api } from "../../api"

const codeLength = 6

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const store = getStore()

  const { logoWebstoreUrl } = location.state ?? {}

  const [phase, setPhase] = useState<"phone" | "code">("phone")
  const [changing, setChanging] = useState(false)
  const [failedCODE, setFailedCODE] = useState(false)

  const [loading, setLoading] = useState(false)

  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")

  const code1 = useRef<HTMLInputElement | null>(null)
  const code2 = useRef<HTMLInputElement | null>(null)
  const code3 = useRef<HTMLInputElement | null>(null)
  const code4 = useRef<HTMLInputElement | null>(null)
  const code5 = useRef<HTMLInputElement | null>(null)
  const code6 = useRef<HTMLInputElement | null>(null)

  const refsRelations = [code1, code2, code3, code4, code5, code6]

  useEffect(() => {
    setPhase("phone")
    store.controllers.user.clear()
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }, [])

  const fadePhases = () => {
    setChanging(true)

    setPhase(phase === "phone" ? "code" : "phone")

    setTimeout(() => {
      setChanging(false)
    }, 400)
  }

  const handleNext = async () => {
    try {
      const cleanPhone = phone.replace(/\D/g, "")

      if (cleanPhone.length === 11) {
        await Api.post.login
          .requestCode({
            phone: cleanPhone,
          })
          .then((res) => {
            if (res.ok) {
              setTimeout(() => {
                fadePhases()
                code1.current?.focus()
              }, 400)
            } else {
              alert(res.error)
            }
          })
      } else alert("Digite um número válido")
    } catch (error) {}
  }

  const handleCodeSubmit = async () => {
    try {
      const login = await Api.post.login.validateCode({
        phone: phone.replace(/\D/g, ""),
        code,
      })
      if (login.ok) {
        localStorage.setItem("user", JSON.stringify(login.data))

        store.controllers.user.setData(login.data)
        navigate("/myTickets")
      } else setFailedCODE(true)
    } catch (error) {
      setFailedCODE(true)
    }
  }

  const handleBack = async () => {
    // check errors
    fadePhases()
    setTimeout(() => {
      setFailedCODE(false)
      setCode("")

      setTimeout(() => {
        document.getElementById("phoneInput")?.focus()
      }, 400)
    }, 200)
  }

  const handleClick = async () => {
    // check errors

    setLoading(true)

    switch (phase) {
      case "phone":
        await handleNext()
        break
      case "code":
        if (failedCODE) {
          setFailedCODE(false)
          setCode("")
          setTimeout(() => {
            code1.current?.focus()
          }, 200)
        } else await handleCodeSubmit()
        break
      default:
        break
    }

    setLoading(false)
  }

  // fields control

  const handlePhone = (v: string) => {
    setPhone(formatPhone(v))
  }

  const handleCode = (v: string) => {
    setCode(v)
  }

  const handleCodeNumber = (key: number, v: string) => {
    const value = v[v.length - 1] ?? ""

    let strPre = code.slice(0, key)
    let strPos = code.slice(key + 1)

    let str = strPre + value + strPos

    switch (key) {
      case 0:
        code2.current?.focus()
        break
      case 1:
        code3.current?.focus()
        break
      case 2:
        code4.current?.focus()
        break
      case 3:
        code5.current?.focus()
        break
      case 4:
        code6.current?.focus()
        break
      case 5:
        if (window.innerWidth < 800) code6.current?.blur()
        break
      default:
        break
    }

    handleCode(str)
  }

  const renderCodeFields = () => {
    let content: JSX.Element[] = []

    for (let i = 0; i < codeLength; i++) {
      content.push(
        <S.Input
          ref={refsRelations[i]}
          type={document.body.clientWidth <= 520 ? "number" : "text"}
          value={code[i] ?? ""}
          onKeyDown={(e) => {
            if (i === codeLength - 1 && e.key === "Enter") {
              handleClick()
            } else if (e.key === "Backspace") {
              if (e.currentTarget.value === "") {
                const isFirst = i === 0
                if (!isFirst) refsRelations[i - 1].current?.focus()
              }
            }
          }}
          onChange={(e) => {
            if (e.target.value === "") {
              let nCode = code
              nCode = nCode
                .split("")
                .map((l, li) => (li !== i ? l : ""))
                .join("")

              handleCode(nCode)
            } else {
              return !failedCODE
                ? handleCodeNumber(i, e.target.value)
                : undefined
            }
          }}
          placeholder={""}
          $small={true}
          disabled={failedCODE}
          autoCapitalize="none"
        />
      )
    }

    return content
  }

  return (
    <S.Page>
      {logoWebstoreUrl && (
        <S.LogoContainer>
          <img src={logoWebstoreUrl} alt="" />
        </S.LogoContainer>
      )}

      <S.FormArea>
        <S.FormTitle>Faça seu login</S.FormTitle>

        <S.Phases>
          <S.Phase $changing={changing} $phase={phase}>
            <S.Inputs>
              <S.Label $k={3}>
                <S.Input
                  id={"phoneInput"}
                  className={"phoneInput"}
                  type={"text"}
                  value={phone}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") e.preventDefault()
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleClick()
                    }
                  }}
                  onChange={(e) => handlePhone(e.target.value)}
                  placeholder={""}
                  inputMode="numeric"
                  enterKeyHint="enter"
                />
                <span>Informe seu celular</span>
              </S.Label>
            </S.Inputs>
          </S.Phase>
          <S.Phase $changing={changing}>
            <S.MessageArea>
              <S.Message $failed={failedCODE}>
                Digite abaixo o código enviado para o seu celular
              </S.Message>
              <S.Message $error={true} $failed={failedCODE}>
                Verifique se seu código e telefone estão corretos
              </S.Message>
            </S.MessageArea>
            <S.CodeArea>
              <S.Label className="code">
                <span>Código</span>
              </S.Label>
              <S.MultipleInputs>{renderCodeFields()}</S.MultipleInputs>
            </S.CodeArea>
          </S.Phase>
        </S.Phases>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            justifyContent: "center",
          }}
        >
          <S.Button
            onClick={handleClick}
            className={"fl ad-1 f"}
            disabled={
              loading ||
              (phase === "phone"
                ? phone.replace(/\D/g, "").length < 11
                : code.length < codeLength)
            }
          >
            {phase === "phone" ? "Próximo" : !failedCODE ? "Entrar" : "Ok"}
          </S.Button>
          {failedCODE && (
            <S.Button
              $noAnimate={true}
              onClick={handleBack}
              disabled={!failedCODE}
            >
              Trocar telefone
            </S.Button>
          )}
        </div>
      </S.FormArea>
    </S.Page>
  )
}

export default Login
