import { TCardTicket, TTicket } from "../../utils/@types/data/ticket"
import * as S from "./styled"

import { Link } from "react-router-dom"
import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg"
import downloadTickets from "../../utils/pdf"
import getStore from "../../store"
import { useCallback, useEffect, useState } from "react"
// import { Api } from "../../api"

type Props = {
  data: TCardTicket
  k: number
}

const TicketCard = ({ k, data }: Props) => {
  const { event } = getStore()

  const [tickets, setTickets] = useState<TTicket[]>([])

  const handleCardClick = (e: any) => {
    e.preventDefault()
  }

  const handleDownload = async (e: any) => {
    e.preventDefault()

    if (event) {
      await downloadTickets(event, tickets, true)
    }
  }

  const handleShare = async (e: any) => {
    e.preventDefault()

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

  const loadTickets = useCallback(async () => {
    try {
      // const req = await Api.get.ticketsById(data.ticketId)

      const falseTicketsList: TTicket[] = [
        {
          id: "id1",
          code: "ASF789FSDFS7",
          bucket: "TRN",
          group_name: "Ingressos",
          name: "Ticket teste",
          price_sell: "3500",
          status: "purchased",
        },
        {
          id: "id2",
          code: "Q789DS797HJK",
          bucket: "TRL",
          group_name: "Ingressos",
          name: "Ticket teste",
          price_sell: "3500",
          status: "purchased",
        },
        {
          id: "id3",
          code: "S9DASK09WQDK",
          bucket: "OPK",
          group_name: "Ingressos",
          name: "Ticket teste",
          price_sell: "3500",
          status: "purchased",
        },
        {
          id: "id4",
          code: "D909D90D90D9",
          bucket: "ABC",
          group_name: "Ingressos",
          name: "Ticket teste",
          price_sell: "3500",
          status: "purchased",
        },
      ]

      setTickets(falseTicketsList)
    } catch (error) {}
  }, [])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  return (
    <S.Component $k={k}>
      <Link
        onClick={handleCardClick}
        to={data.name.toLowerCase().replace(/\s+/g, "-")}
        state={{
          data,
        }}
      >
        <S.ImageContainer>
          <img src={data.eventBanner} alt={""} />
        </S.ImageContainer>
        <S.EventInfo>
          <S.CardBottom>
            <S.EventName>{data.name}</S.EventName>
            <S.Icons className="iconsArea">
              <button onClick={handleDownload}>
                <DownloadIcon width={24} height={24} />
              </button>
              {navigator.canShare && navigator.canShare() && (
                <button onClick={handleShare}>
                  <ShareIcon width={24} height={24} />
                </button>
              )}
            </S.Icons>
          </S.CardBottom>
          <S.CardBottom>
            <S.EventDate>{data.price_sell}</S.EventDate>
            <S.TicketsQnt>Tickets: {data.ticketsQnt}</S.TicketsQnt>
          </S.CardBottom>
        </S.EventInfo>
      </Link>
    </S.Component>
  )
}

export default TicketCard
