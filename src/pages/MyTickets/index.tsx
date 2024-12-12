import { useEffect, useState } from "react"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"

import getStore from "../../store"
import { useNavigate } from "react-router-dom"
import TicketCard from "../../components/TicketCard"
import { Api } from "../../api"

const MyTickets = () => {
  const { controllers } = getStore()

  const navigate = useNavigate()

  const [list, setList] = useState<any[]>([])

  const getData = async (eventInfo: any) => {
    try {
      const req = await Api.get.myTickets({ eventId: eventInfo?.id as string })

      if (req.ok) {
        setList(
          req.data.list
            .map((i) => ({
              ...i,
              eventBanner: eventInfo?.event_banner as string,
            }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .reverse()
        )
      }
    } catch (error) {}
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token")

    if (token) {
      const eventData = sessionStorage.getItem("event")

      if (eventData) {
        controllers.event.setData(JSON.parse(eventData))
        getData(JSON.parse(eventData))
      } else {
        navigate("/eventSelect")
      }
    } else {
      navigate("/eventSelect")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <S.Page>
      <Header />

      <Container fullHeight={true}>
        <S.Main>
          <S.PageTitle>Meus tickets</S.PageTitle>

          {list.length === 0 ? (
            <S.PageTitle $align="center">
              Você não possui ingressos para esse evento
            </S.PageTitle>
          ) : (
            <S.List>
              {list.map((ticket, k) => (
                <TicketCard k={k} key={k} data={ticket} />
              ))}
            </S.List>
          )}
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default MyTickets
