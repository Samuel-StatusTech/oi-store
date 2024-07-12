import { useCallback, useEffect, useState } from "react"
import { TCardTicket, TShoppingTicket } from "../../utils/@types/data/ticket"
import * as S from "./styled"

import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg"

import getStore from "../../store"
import downloadTickets from "../../utils/pdf"

type Props = {
  data: TCardTicket
  k: number
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

const TicketCard = ({ k, data }: Props) => {
  const { event } = getStore()

  const [tickets, setTickets] = useState<TShoppingTicket[]>([])

  const loadTickets = useCallback(async () => {
    try {
      // const req = await Api.get.ticketsById(data.ticketId)

      setTickets(falseTicketsList)
    } catch (error) {}
  }, [])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const handleDownload = async () => {
    if (event) await downloadTickets(event, tickets, true)
  }

  const handleShare = async () => {
    if (navigator.canShare() && event) {
      try {
        const file = await downloadTickets(event, tickets)

        if (file instanceof File) {
          navigator.share({
            title: `Meus Tickets para ${event.name}`,
            files: [file],
          })
        }
      } catch (error) {}
    }
  }

  const renderBtns = () => (
    <S.Icons className="iconsArea">
      <div onClick={handleDownload}>
        <DownloadIcon />
        <span>Baixar</span>
      </div>
      <div onClick={handleShare}>
        <ShareIcon />
        <span>Enviar</span>
      </div>
    </S.Icons>
  )

  const renderPrice = () => <S.EventDate>{data.price_sell}</S.EventDate>

  return (
    <S.Component $k={k}>
      <div>
        <S.ImageContainer>
          <img src={data.eventBanner} alt={""} />
        </S.ImageContainer>
        <S.EventInfo>
          <S.CardBottom>
            <S.EventName>{data.name}</S.EventName>
            {renderPrice()}
          </S.CardBottom>
          <S.CardBottom>
            {renderBtns()}
            <S.TicketsQnt>Tickets: {data.ticketsQnt}</S.TicketsQnt>
          </S.CardBottom>
        </S.EventInfo>
      </div>
    </S.Component>
  )
}

export default TicketCard
