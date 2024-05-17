import { useCallback, useEffect, useState } from "react"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import TicketCard from "../../components/TicketCard"

import { placeList } from "./placeList"

const MyTickets = () => {
  const [list, setList] = useState<any[]>([])

  const getData = useCallback(() => {
    setList(placeList)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <S.Page>
      <Header />

      <Container>
        <S.Main>
          <S.PageTitle>Meus tickets</S.PageTitle>

          <S.List>
            {list.map((ticket, k) => (
              <TicketCard key={k} data={ticket} />
            ))}
          </S.List>
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default MyTickets
