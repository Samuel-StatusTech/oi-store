import { Link, useNavigate } from "react-router-dom"
import Container from "../Container"
import * as S from "./styled"

import getStore from "../../store"

const Header = () => {
  const navigate = useNavigate()

  const { event, user } = getStore()

  const handleBtn = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    to: string
  ) => {
    e.preventDefault()
    navigate(to, {
      state: {
        logoFixed: event?.logoFixed,
      },
    })
  }

  const renderButton = () => {
    return !document.location.href.includes("/eventSelect") ? (
      <Link
        to={user ? "/mytickets" : "/login"}
        className="myTickets"
        onClick={(e) => handleBtn(e, user ? "/mytickets" : "/login")}
      >
        {user ? "Meus Ingressos" : "Fazer login"}
      </Link>
    ) : (
      !user && (
        <Link
          to={"/login"}
          className="myTickets"
          onClick={(e) => handleBtn(e, "/login")}
        >
          {"Fazer login"}
        </Link>
      )
    )
  }

  return (
    <S.Wrapper>
      <Container>
        <S.Component>
          <S.LogoArea>
            <Link to={"/eventSelect"}>
              {event?.logoFixed ? (
                <img src={event?.logoFixed} alt={event?.corporateName} />
              ) : (
                <span>Início</span>
              )}
            </Link>
          </S.LogoArea>
          <S.UserArea>{renderButton()}</S.UserArea>
        </S.Component>
      </Container>
    </S.Wrapper>
  )
}

export default Header
