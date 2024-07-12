import { useCallback, useEffect, useState } from "react"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import TicketCard from "../../components/TicketCard"

import { placeList } from "./placeList"
import getStore from "../../store"
import { useNavigate } from "react-router-dom"

const MyTickets = () => {
  const { event } = getStore()

  const navigate = useNavigate()

  const [list, setList] = useState<any[]>([])

  const getData = useCallback(() => {
    setList(
      placeList.map((i) => ({
        ...i,
        eventBanner: event?.event_banner as string,
      }))
    )
  }, [event?.event_banner])

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
