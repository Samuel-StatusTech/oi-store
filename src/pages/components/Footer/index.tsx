import * as S from "./styled"
import logo from "../../../assets/images/oi-tickets.png"
import Container from "../Container"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <S.Component>
      <Container>
        <S.Main>
          <img src={logo} alt={""} />
          <S.ColsArea>
            <div />
            <S.Col>
              <S.ColTitle>Termos</S.ColTitle>
              <S.ColContent>
                <Link to={""}>Termos de uso</Link>
                <Link to={""}>Política de privacidade</Link>
                <Link to={""}>Política de cancelamento</Link>
              </S.ColContent>
            </S.Col>
            <S.Col>
              <S.ColTitle>Ajuda</S.ColTitle>
              <S.ColContent>
                <Link to={""}>Fale com a gente</Link>
              </S.ColContent>
            </S.Col>
            <div />
          </S.ColsArea>
        </S.Main>
      </Container>
      <S.CopyArea>
        <S.CopyItem>© Oi Tickets. Todos os direitos reservados. </S.CopyItem>
        <S.CopyItem>Avenida Rolf Wiest, 277 </S.CopyItem>
        <S.CopyItem>- Bom Retiro, Joinville - SC, 89223-005 - </S.CopyItem>
        <S.CopyItem>CNPJ 27.503.375/0001-20</S.CopyItem>
      </S.CopyArea>
    </S.Component>
  )
}

export default Footer
