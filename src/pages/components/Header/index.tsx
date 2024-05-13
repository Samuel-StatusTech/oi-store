import { Link } from "react-router-dom"
import Container from "../Container"
import * as S from "./styled"

import MainLogo from "../../../assets/images/oi-tickets.png"

const Header = () => {
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
            <Link to={"/mytickets"} className="myTickets">
              Meus Ingressos
            </Link>
          </S.UserArea>
        </S.Component>
      </Container>
    </S.Wrapper>
  )
}

export default Header
