import { useCallback, useEffect, useState } from "react"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import EventCard from "../../components/EventCard"

import { Api } from "../../api"
import { parseList } from "../../utils/tb/parseList"
import getStore from "../../store"

const EventSelect = () => {
  const store = getStore()

  const [list, setList] = useState<any[]>([])

  const getData = useCallback(async () => {
    const events = await Api.get.events({})

    if (events.ok) {
      setList(parseList.eventMinToEventCard(events.data))
    } else {
      alert(events.error)
    }
  }, [])

  useEffect(() => {
    store.controllers.event.clear()

    getData()
  }, [store.controllers, getData])

  return (
    <S.Page>
      <Header />

      <Container fullHeight={true}>
        <S.Main>
          <S.PageTitle>Eventos</S.PageTitle>

          <S.List>
            {list.map((ticket, k) => (
              <EventCard key={k} data={ticket} />
            ))}
          </S.List>
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default EventSelect
