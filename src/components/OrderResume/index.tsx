/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback } from "react"
import { formatMoney } from "../../utils/tb/formatMoney"
import * as S from "./styled"

import clockIcon from "../../assets/icons/time.png"

import Ticket from "../Ticket"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { Api } from "../../api"
import getStore from "../../store"

type Props = {
  datePeriod: string
  ticketsList: TTicketDisposal[]
  setTickets: (list: TTicketDisposal[]) => void
}

const OrderResume = ({ datePeriod, ticketsList, setTickets }: Props) => {
  const { event, controllers } = getStore()

  const loadEventData = useCallback(async () => {
    if (event) {
      try {
        const req = await Api.get.eventInfo({ eventId: event?.id })

        if (req.ok) {
          const data = req.data
          controllers.event.setData(data)
        }
      } catch (error) {
        alert("Erro ao carregar os tickets")
      }
    }
  }, [])

  useEffect(() => {
    loadEventData()
  }, [loadEventData])

  const sumTickets = () => {
    let total = 0

    ticketsList.forEach((t) => {
      total += t.price_sell * t.qnt
    })

    return total
  }

  const sumTaxes = () => {
    let total = 0
    const hasTax = event?.eCommerce.adminTax
    const isTaxAbsolute = event?.eCommerce.adminTaxValue !== 0

    const ticketsTotal = sumTickets()

    if (hasTax) {
      if (isTaxAbsolute) total = +event?.eCommerce.adminTaxValue
      else {
        const taxMin = +event?.eCommerce.adminTaxMinimum
        const calculedTax =
          ticketsTotal * (+event.eCommerce.adminTaxPercentage / 100 / 100)

        const min = Math.max(taxMin, calculedTax)
        total = min
      }
    }

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

  const renderTaxResume = () => {
    let str = ""

    if (event) {
      const minValue = +event.eCommerce.adminTaxMinimum ?? 0
      const percentTax = sumTaxes()

      str =
        percentTax > minValue
          ? `(${+event.eCommerce.adminTaxPercentage / 100}%)`
          : "min"
    }

    return str
  }

  return (
    <S.Component>
      {event?.event_banner && (
        <S.ImageContainer>
          <img src={event?.event_banner} alt={""} />
        </S.ImageContainer>
      )}

      <S.Info>
        <S.EventResume>
          <S.ResumeText>Resumo do pedido</S.ResumeText>
          <div>
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
            <span>Taxas {renderTaxResume()}</span>
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
