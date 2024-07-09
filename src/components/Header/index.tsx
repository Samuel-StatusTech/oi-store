import { Link } from "react-router-dom"
import Container from "../Container"
import * as S from "./styled"

import getStore from "../../store"

const Header = () => {
  const { event, user } = getStore()

  return (
    <S.Wrapper>
      <Container>
        <S.Component>
          <S.LogoArea>
            {event?.logoFixed && (
              <Link to={"/"}>
                <img src={event?.logoFixed} alt={event?.corporateName} />
              </Link>
            )}
          </S.LogoArea>
          <S.UserArea>
            {event && (
              <Link to={user ? "/mytickets" : "/login"} className="myTickets">
                {user ? "Meus Ingressos" : "Fazer login"}
              </Link>
            )}
          </S.UserArea>
        </S.Component>
      </Container>
    </S.Wrapper>
  )
}

export default Header
