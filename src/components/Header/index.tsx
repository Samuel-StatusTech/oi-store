import { Link, useNavigate } from "react-router-dom"
import Container from "../Container"
import * as S from "./styled"

import { ReactComponent as BurguerIcon } from "../../assets/icons/burguer.svg"

import getStore from "../../store"
import { useEffect, useRef, useState } from "react"

const Header = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const navigate = useNavigate()

  const { event, user } = getStore()

  const [sideOpened, setSideOpened] = useState(false)

  const toggleSideMenu = () => {
    if (window.document.body.clientWidth <= 520) {
      window.document.body.style.overflow = !sideOpened ? "hidden" : "unset"

      setSideOpened(!sideOpened)
    }
  }

  const handleBtn = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    to: string
  ) => {
    e.preventDefault()
    toggleSideMenu()
    navigate(to, {
      state: {
        logoFixed: event?.logoFixed,
      },
    })
  }

  const renderButton = () => {
    return (
      <div style={{ display: "flex", gap: 8 }} className="btns-wrapper">
        {!document.location.href.includes("/eventSelect") ? (
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
        )}

        {user && (
          <Link
            to={"/login"}
            className="logout"
            onClick={(e) => handleBtn(e, "/login")}
          >
            {"Realizar logout"}
          </Link>
        )}
      </div>
    )
  }

  useEffect(() => {
    const collapseOwnDropdown = () => {
      setSideOpened(false)
    }

    const handleClickOutside = (e: any) => {
      if (e.target !== document.children[0]) {
        if (!wrapperRef.current?.contains(e.target) && sideOpened)
          collapseOwnDropdown()
      }
    }

    if (sideOpened) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [wrapperRef, sideOpened])

  return (
    <S.Wrapper ref={wrapperRef}>
      <Container>
        <S.Component>
          <S.LogoArea>
            <Link to={"/eventSelect"}>
              {event?.logoWebstore ? (
                <img src={event?.logoWebstore} alt={event?.corporateName} />
              ) : (
                <span>Início</span>
              )}
            </Link>
          </S.LogoArea>
          <S.UserArea $opened={sideOpened}>
            <S.BurguerWrapper $opened={sideOpened} onClick={toggleSideMenu}>
              <BurguerIcon />
            </S.BurguerWrapper>
            {renderButton()}
          </S.UserArea>
        </S.Component>
      </Container>
    </S.Wrapper>
  )
}

export default Header
