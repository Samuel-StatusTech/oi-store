import { Link } from "react-router-dom"
import Container from "../Container"
import * as S from "./styled"

import MainLogo from "../../assets/images/oi-tickets.png"
import getStore from "../../store"

const Header = () => {
  const { event } = getStore()

  return (
    <S.Wrapper>
      <Container>
        <S.Component>
          <S.LogoArea>
            <Link to={"/"}>
              <img src={MainLogo} alt="OiTickets" />
            </Link>
          </S.LogoArea>
          <S.UserArea>
            {event && (
              <Link to={"/mytickets"} className="myTickets">
                Meus Ingressos
              </Link>
            )}
          </S.UserArea>
        </S.Component>
      </Container>
    </S.Wrapper>
  )
}

export default Header
