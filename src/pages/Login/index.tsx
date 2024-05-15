import { useState } from "react"
import * as S from "./styled"

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
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  return (
    <S.Page>
      <S.FormArea>
        <S.FormTitle>Evento Teste</S.FormTitle>

        <S.Inputs>
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Senha" value={pass} onChange={setPass} />
        </S.Inputs>

        <S.Button>Entrar</S.Button>
      </S.FormArea>
    </S.Page>
  )
}

export default Login
