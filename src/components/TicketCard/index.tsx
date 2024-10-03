import { useEffect, useState } from "react"
import { TShoppingTicket } from "../../utils/@types/data/ticket"
import * as S from "./styled"

import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg"

import getStore from "../../store"
import downloadTickets from "../../utils/pdf"
import { formatMoney } from "../../utils/tb/formatMoney"

type Props = {
  data: any
  k: number
}

const TicketCard = ({ k, data }: Props) => {
  const { event } = getStore()

  const [tickets, setTickets] = useState<TShoppingTicket[]>([])

  useEffect(() => {
    if (Array.isArray(data.products)) setTickets(data.products)
  }, [data.products])

  const handleDownload = async () => {
    if (event) await downloadTickets(event, tickets, true)
  }

  const handleShare = async () => {
    try {
      if (event) {
        const file = await downloadTickets(event, tickets)

        if (file instanceof File) {
          const data = {
            title: `Meus Tickets para ${event.name}`,
            text: `Meus Tickets para ${event.name}`,
            files: [file],
          }

          if (navigator.canShare && navigator.canShare(data)) {
            navigator.share(data)
          }
        }
      }
    } catch (error) {}
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

  const renderPrice = () => (
    <S.EventDate>{formatMoney(+data.total_price, true)}</S.EventDate>
  )

  const getDate = () => {
    // @ts-ignore
    const _d = data.date.split("-")
    const d =
      _d.length > 0 ? new Date(_d[0], _d[1], _d[2]) : new Date(data.date)

    const todayStr = `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`

    return todayStr
  }

  return (
    <S.Component $k={k}>
      <div>
        <S.ImageContainer>
          <img src={data.eventBanner} alt={""} />
        </S.ImageContainer>
        <S.EventInfo>
          <S.CardBottom>
            <S.EventName>{getDate()}</S.EventName>
            {renderPrice()}
          </S.CardBottom>
          <S.CardBottom>
            {renderBtns()}
            {/* @ts-ignore */}
            <S.TicketsQnt>Tickets: {data.quantity}</S.TicketsQnt>
          </S.CardBottom>
        </S.EventInfo>
      </div>
    </S.Component>
  )
}

export default TicketCard
