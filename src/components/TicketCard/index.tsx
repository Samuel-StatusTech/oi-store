import { useEffect, useState } from "react"
import { TShoppingTicket } from "../../utils/@types/data/ticket"
import * as S from "./styled"

import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg"

import getStore from "../../store"
import downloadTickets from "../../utils/pdf"
import { formatMoney } from "../../utils/tb/formatMoney"
import { formatDate } from "date-fns"

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
            title: `Meus Ingressos para ${event.name}`,
            text: `Meus Ingressos para ${event.name}`,
            files: [file],
          }

          const isMobile = window.document.body.clientWidth <= 520

          if (isMobile) {
            if (navigator.canShare({ files: [file] })) {
              navigator.share(data)
            } else if (navigator.share !== undefined) {
              await navigator.share(data)
            } else {
              alert(
                "Seu navegador não suporta compartilhamento. Faça o download e compartilhe manualmente."
              )
            }
          } else {
            if (navigator.canShare(data)) {
              navigator.share(data)
            } else if (navigator.share !== undefined) {
              await navigator.share(data)
            } else {
              alert(
                "Seu navegador não suporta compartilhamento. Faça o download e compartilhe manualmente."
              )
            }
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
      <div onClick={handleShare} className="shareBtn">
        <ShareIcon />
        <span>Enviar</span>
      </div>
    </S.Icons>
  )

  // const renderEventDate = () => {
  //   if (event) {
  //     const eventDateText =
  //       event.date_end === event.date_ini
  //         ? formatDate(event.date_ini, "dd/MM/yyyy")
  //         : `${formatDate(event.date_ini, "dd/MM/yyyy")} até ${formatDate(
  //             event.date_end,
  //             "dd/MM/yyyy"
  //           )}`

  //     return <S.EventDate>{eventDateText}</S.EventDate>
  //   }
  // }

  const renderPrice = () => (
    <S.EventDate>{formatMoney(+data.total_price, true)}</S.EventDate>
  )

  const getDate = () => {
    const todayStr = formatDate(data.date, "dd/MM/yyyy")

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
            {/* {renderEventDate()} */}
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
