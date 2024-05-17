import { useCallback, useEffect, useState } from "react"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"

import { placeList } from "./placeList"
import { useLocation } from "react-router-dom"
import EventTicketItem from "../../components/EventTicketItem"
import { TTicket } from "../../utils/@types/ticket"
import TicketModal from "../../components/TicketModal"

const MyEventTickets = () => {
  const location = useLocation()
  const { data: event } = location.state

  const [list, setList] = useState<TTicket[]>([])
  const [modal, setModal] = useState<any>({ shown: false, data: null })

  const sortList = (newList: TTicket[]) =>
    newList.sort((a, b) => {
      if (b.status !== a.status) {
        if (a.status === "purchased") return -1
        else if (a.status === "validated")
          return b.status === "purchased" ? 1 : -1
        else if (a.status === "expired") return 1
      }

      return 0
    })

  const getData = useCallback(() => {
    // ... get tickets for event

    const sortedList = sortList(placeList)

    setList(sortedList)
  }, [])

  const handleExpand = (ticket: TTicket) => {
    setModal({
      shown: true,
      data: ticket,
    })
  }

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <S.Page>
      <Header />

      <TicketModal
        {...modal}
        handleClose={() => setModal({ shown: false, data: null })}
      />

      <Container>
        <S.Main>
          <S.PageTitle>Meus tickets para {event?.eventName} </S.PageTitle>

          <S.List>
            {list.map((ticket, k) => (
              <EventTicketItem
                key={k}
                data={ticket}
                handleExpand={handleExpand}
              />
            ))}
          </S.List>
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default MyEventTickets
