import * as S from "./styled"

import Container from "../Container"
import { Link } from "react-router-dom"
import getStore from "../../store"
import { formatCNPJ } from "../../utils/masks/cnpj"

const Footer = () => {
  const { event } = getStore()

  return (
    <S.Component>
      <Container>
        <S.Main>
          {event?.logoFixed && (
            <img src={event?.logoFixed} alt={event?.corporateName} />
          )}

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
        <S.CopyItem>
          © {event?.corporateName}. Todos os direitos reservados.{" "}
        </S.CopyItem>
        <S.CopyItem>{event?.address}</S.CopyItem>
        <S.CopyItem>
          - {event?.city} - {event?.uf} -
        </S.CopyItem>
        <S.CopyItem>CNPJ {formatCNPJ(event?.CNPJ ?? "")}</S.CopyItem>
      </S.CopyArea>
    </S.Component>
  )
}

export default Footer
