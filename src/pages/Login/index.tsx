import { useState } from "react"
import * as S from "./styled"
import { useLocation, useNavigate } from "react-router-dom"

type IProps = {
  label: string
  value: string
  onChange: (str: string) => void
}

const Input = ({ label, value, onChange }: IProps) => {
  return (
    <S.Label>
      <S.Input
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

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  const handleClick = () => {
    // check errors

    localStorage.setItem("logged", "true")

    if (location.state) {
      const { originalPath } = location.state
      navigate(originalPath ?? "/")
    } else {
      navigate("/")
    }
  }

  return (
    <S.Page>
      <S.FormArea>
        <S.FormTitle>Evento Teste</S.FormTitle>

        <S.Inputs>
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Senha" value={pass} onChange={setPass} />
        </S.Inputs>

        <S.Button onClick={handleClick}>Entrar</S.Button>
      </S.FormArea>
    </S.Page>
  )
}

export default Login
