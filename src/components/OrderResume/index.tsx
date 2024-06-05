import { useEffect, useState } from "react"
import { formatMoney } from "../../utils/tb/formatMoney"
import * as S from "./styled"

import eventLogo from "../../assets/images/exemplo.png"
import clockIcon from "../../assets/icons/time.png"

import Ticket from "../Ticket"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { Api } from "../../api"
import { TEventData } from "../../utils/@types/data/event"

const eventId = "216fb5ab4ddf"

type Props = {
  datePeriod: string
  ticketsList: TTicketDisposal[]
  setTickets: (list: TTicketDisposal[]) => void
}

const OrderResume = ({ datePeriod, ticketsList, setTickets }: Props) => {
  const [event, setEvent] = useState<null | TEventData>(null)

  const loadEventInfo = async () => {
    const data = await Api.get.eventInfo({ eventId }).then((res) => {
      return res.ok ? res.data : null
    })

    // @ts-ignore
    if (data) setEvent({ ...data, image: eventLogo })
    // @ts-ignore
    else setEvent({ image: eventLogo })
  }

  useEffect(() => {
    loadEventInfo()
  }, [])

  const sumTickets = () => {
    let total = 0

    ticketsList.forEach((t) => {
      total += t.price_sell * t.qnt
    })

    return total
  }

  const sumTaxes = () => {
    let total = 0

    const ticketsTotal = sumTickets()

    total = ticketsTotal * 0.15
    // ((event?.eCommerce.adminTaxPercentage ?? 100) / 100 / 100) ?? 0

    return total
  }

  const sumTotal = () => {
    const ticketsTotal = sumTickets()
    const taxesTotal = sumTaxes()

    return ticketsTotal + taxesTotal
  }

  const getRefreshHour = () => {
    const today = new Date()
    today.setHours(today.getHours() + 3)

    const hours = String(today.getHours()).padStart(2, "0")
    const minutes = String(today.getMinutes()).padStart(2, "0")

    return `${hours}:${minutes}`
  }

  return (
    <S.Component>
      <S.ImageContainer>
        {/* @ts-ignore */}
        <img src={event?.image} alt={""} />
      </S.ImageContainer>

      <S.Info>
        <S.EventResume>
          <S.ResumeText>Resumo do pedido</S.ResumeText>
          <div style={{ display: "flex" }}>
            <S.DateText>Data</S.DateText>
            <S.DateText>{datePeriod}</S.DateText>
          </div>
        </S.EventResume>
        <S.TicketsList>
          {ticketsList.map((ticket, k) => (
            <Ticket ticket={ticket} key={k} />
          ))}
        </S.TicketsList>
        <S.Total>
          <S.TotalItem>
            <span>Subtotal</span>
            <span>{formatMoney(sumTickets(), true)}</span>
          </S.TotalItem>
          <S.TotalItem>
            <span>Taxas (1.5%)</span>
            <span>{formatMoney(sumTaxes(), true)}</span>
          </S.TotalItem>
          <S.TotalItem $main={true}>
            <span>TOTAL</span>
            <span>{formatMoney(sumTotal(), true)}</span>
          </S.TotalItem>
        </S.Total>
      </S.Info>

      {/* Release block */}
      <S.ReleaseBlock>
        <S.RLeft>
          <img src={clockIcon} alt={""} />
          <span>{getRefreshHour()}</span>
        </S.RLeft>
        <S.RRight>
          <span>
            Após este tempo, os ingressos serão liberados para venda novamente
          </span>
        </S.RRight>
      </S.ReleaseBlock>
    </S.Component>
  )
}

export default OrderResume
