import { useCallback, useEffect, useState } from "react"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
// import TicketCard from "../../components/TicketCard"

import getStore from "../../store"
import { useNavigate } from "react-router-dom"
import TicketCard from "../../components/TicketCard"
import { Api } from "../../api"

const MyTickets = () => {
  const { event } = getStore()

  const navigate = useNavigate()

  const [list, setList] = useState<any[]>([])

  const getData = useCallback(async () => {
    try {
      const req = await Api.get.myTickets({ eventId: event?.id as string })

      
      if (req.ok) {
        console.log(req.data.list)
        
        setList(
          req.data.list.map((i) => ({
            ...i,
            eventBanner: event?.event_banner as string,
          }))
        )
      }
    } catch (error) {}
  }, [event?.event_banner, event?.id])

  useEffect(() => {
    if (!event) navigate("/eventSelect")
    else getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getData, event])

  return (
    <S.Page>
      <Header />

      <Container fullHeight={true}>
        <S.Main>
          <S.PageTitle>Meus tickets</S.PageTitle>

          <S.List>
            {list.map((ticket, k) => (
              <TicketCard k={k} key={k} data={ticket} />
            ))}
          </S.List>
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default MyTickets
