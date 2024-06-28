import { useState } from "react"
import * as S from "./styled"
import { useLocation, useNavigate } from "react-router-dom"
import getStore from "../../store"
import { Api } from "../../api"

type IProps = {
  label: string
  value: string
  onChange: (str: string) => void
  type?: string
}

const Input = ({ label, value, onChange, type }: IProps) => {
  return (
    <S.Label>
      <S.Input
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={""}
      />
      <span>{label}</span>
    </S.Label>
  )
}

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const store = getStore()

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  const handleClick = async () => {
    // check errors

    const login = await Api.post.login({ username: email, password: pass })

    if (login.ok) {
      store.controllers.user.setData(login.data)
      localStorage.setItem("logged", "true")

      if (location.state) {
        const { originalPath } = location.state
        navigate(originalPath ?? "/")
      } else {
        navigate("/")
      }
    } else {
      alert(login.error)
    }
  }

  return (
    <S.Page>
      <S.FormArea>
        <S.FormTitle>Faça seu login</S.FormTitle>

        <S.Inputs>
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Senha" value={pass} onChange={setPass} type="password" />
        </S.Inputs>

        <S.Button onClick={handleClick}>Entrar</S.Button>
      </S.FormArea>
    </S.Page>
  )
}

export default Login
