/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import * as S from "./styled"
import { useLocation, useNavigate } from "react-router-dom"
import { formatPhone } from "../../utils/masks/phone"
import getStore from "../../store"
import { Api } from "../../api"

const constCODE = "ab12"

const codeLength = 4

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const store = getStore()

  const { logoFixed } = location.state ?? {}

  const [phase, setPhase] = useState<"phone" | "code">("phone")
  const [changing, setChanging] = useState(false)
  const [failedCODE, setFailedCODE] = useState(false)

  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")

  const code1 = useRef<HTMLInputElement | null>(null)
  const code2 = useRef<HTMLInputElement | null>(null)
  const code3 = useRef<HTMLInputElement | null>(null)
  const code4 = useRef<HTMLInputElement | null>(null)

  const refsRelations = [code1, code2, code3, code4]

  useEffect(() => {
    setPhase("phone")
    store.controllers.user.clear()
    localStorage.removeItem("token")
  }, [])

  const fadePhases = () => {
    setChanging(true)

    setPhase(phase === "phone" ? "code" : "phone")

    setTimeout(() => {
      setChanging(false)
    }, 400)
  }

  const handleNext = () => {
    // Api.post.askCode({ phone: phone.replace(...) })

    fadePhases()
  }

  const handleCodeSubmit = async () => {
    try {
      // dev
      if (code === constCODE) {
        const login = await Api.post.login({
          username: "Customert2",
          password: "123456",
        })
        if (login.ok) {
          store.controllers.user.setData(login.data)
          navigate("/myTickets")
        } else setFailedCODE(true)
      } else setFailedCODE(true)
    } catch (error) {
      setFailedCODE(true)
    }
  }

  const handleClick = async () => {
    // check errors

    switch (phase) {
      case "phone":
        handleNext()

        setTimeout(() => {
          code1.current?.focus()
        }, 400)
        break
      case "code":
        if (failedCODE) {
          fadePhases()
          setTimeout(() => {
            setFailedCODE(false)
            setCode("")

            setTimeout(() => {
              document.getElementById("phoneInput")?.focus()
            }, 400)
          }, 200)
        } else handleCodeSubmit()
        break
      default:
        break
    }
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
        if (window.innerWidth < 800) code4.current?.blur()
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
          type={"text"}
          value={code[i] ?? ""}
          onChange={(e) =>
            !failedCODE ? handleCodeNumber(i, e.target.value) : undefined
          }
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
      {logoFixed && (
        <S.LogoContainer>
          <img src={logoFixed} alt="" />
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
                Número de telefone ou código invalidos
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

        <S.Button
          onClick={handleClick}
          className={"fl ad-1 f"}
          disabled={
            phase === "phone"
              ? phone.replace(/\D/g, "").length < 11
              : code.length < codeLength
          }
        >
          {phase === "phone" ? "Próximo" : !failedCODE ? "Entrar" : "Ok"}
        </S.Button>
      </S.FormArea>
    </S.Page>
  )
}

export default Login
