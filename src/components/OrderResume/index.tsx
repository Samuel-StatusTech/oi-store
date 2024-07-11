/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useState } from "react"
import { formatMoney } from "../../utils/tb/formatMoney"
import * as S from "./styled"

import clockIcon from "../../assets/icons/time.png"

import Ticket from "../Ticket"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { Api } from "../../api"
import getStore from "../../store"
import { sumTaxes, sumTickets } from "../../utils/tb/taxes"
import { useNavigate } from "react-router-dom"

type Props = {
  datePeriod: string
  ticketsList: TTicketDisposal[]
  setTickets: (list: TTicketDisposal[]) => void
}

const OrderResume = ({ datePeriod, ticketsList, setTickets }: Props) => {
  const navigate = useNavigate()

  const { event, controllers } = getStore()

  const [taxes, setTaxes] = useState(0)
  const [ticketsTotal, setTicketsTotal] = useState(0)

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
        navigate("/")
      }
    } else navigate("/")
  }, [])

  const sumValues = () => {
    try {
      const ticketsTotal = sumTickets(ticketsList)
      const taxesTotal = sumTaxes({
        ticketsTotal,
        adminTax: event?.eCommerce.adminTax,
        adminTaxMinimum: event?.eCommerce.adminTaxMinimum,
        adminTaxPercentage: event?.eCommerce.adminTaxPercentage,
        adminTaxValue: event?.eCommerce.adminTaxValue,
      })

      setTaxes(taxesTotal)
      setTicketsTotal(ticketsTotal)
    } catch (error) {
      alert("Erro ao carregar os tickets")
      navigate("/")
    }
  }

  useEffect(() => {
    loadEventData()
  }, [loadEventData])

  useEffect(() => {
    sumValues()
  }, [ticketsList])

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
      const ticketsTotal = sumTickets(ticketsList)
      const percentTax = sumTaxes({
        ticketsTotal,
        adminTax: event?.eCommerce.adminTax,
        adminTaxMinimum: event?.eCommerce.adminTaxMinimum,
        adminTaxPercentage: event?.eCommerce.adminTaxPercentage,
        adminTaxValue: event?.eCommerce.adminTaxValue,
      })

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
            <span>{formatMoney(ticketsTotal, true)}</span>
          </S.TotalItem>
          <S.TotalItem>
            <span>Taxas {renderTaxResume()}</span>
            <span>{formatMoney(taxes, true)}</span>
          </S.TotalItem>
          <S.TotalItem $main={true}>
            <span>TOTAL</span>
            <span>{formatMoney(ticketsTotal + taxes, true)}</span>
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
