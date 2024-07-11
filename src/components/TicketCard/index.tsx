import { TCardTicket, TShoppingTicket } from "../../utils/@types/data/ticket"
import * as S from "./styled"

import { useCallback, useEffect, useState } from "react"

type Props = {
  data: TCardTicket
  k: number
  togglePopup: (tickets: TShoppingTicket[]) => void
}

const falseTicketsList: TShoppingTicket[] = [
  {
    id: "id1",
    name: "Ticket teste",
    batch_name: "Mesas VIP",
    event_name: "Show Roberto Carlos",
    qr_data: "ASF789FSDFS7",
    order_id: "AHJW918-FJSJ453-SAJS229",
    date: new Date().toISOString(),
    image: null,
    quantity: 2,
    price_unit: 4900,
  },
  {
    id: "id2",
    name: "Ticket teste",
    batch_name: "Mesas VIP",
    event_name: "Show Roberto Carlos",
    qr_data: "ASF789FSDFS7",
    order_id: "AHJW918-FJSJ453-SAJS229",
    date: new Date().toISOString(),
    image: null,
    quantity: 2,
    price_unit: 4900,
  },
  {
    id: "id3",
    name: "Ticket teste",
    batch_name: "Mesas VIP",
    event_name: "Show Roberto Carlos",
    qr_data: "Q789DS797HJK",
    order_id: "AHJW918-FJSJ453-SAJS229",
    date: new Date().toISOString(),
    image: null,
    quantity: 2,
    price_unit: 4900,
  },
  {
    id: "id4",
    name: "Ticket teste",
    batch_name: "Mesas VIP",
    event_name: "Show Roberto Carlos",
    qr_data: "S9DASK09WQDK",
    order_id: "AHJW918-FJSJ453-SAJS229",
    date: new Date().toISOString(),
    image: null,
    quantity: 2,
    price_unit: 4900,
  },
]

const TicketCard = ({ k, data, togglePopup }: Props) => {
  const [tickets, setTickets] = useState<TShoppingTicket[]>([])

  const handleCardClick = () => {
    togglePopup(tickets)
  }

  const loadTickets = useCallback(async () => {
    try {
      // const req = await Api.get.ticketsById(data.ticketId)

      setTickets(falseTicketsList)
    } catch (error) {}
  }, [])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  return (
    <S.Component $k={k}>
      <div onClick={handleCardClick}>
        <S.ImageContainer>
          <img src={data.eventBanner} alt={""} />
        </S.ImageContainer>
        <S.EventInfo>
          <S.CardBottom>
            <S.EventName>{data.name}</S.EventName>
          </S.CardBottom>
          <S.CardBottom>
            <S.EventDate>{data.price_sell}</S.EventDate>
            <S.TicketsQnt>Tickets: {data.ticketsQnt}</S.TicketsQnt>
          </S.CardBottom>
        </S.EventInfo>
      </div>
    </S.Component>
  )
}

export default TicketCard
