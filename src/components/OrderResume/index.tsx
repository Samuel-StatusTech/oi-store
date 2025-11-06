/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useState } from "react"
import { formatMoney } from "../../utils/tb/formatMoney"
import * as S from "./styled"

// import clockIcon from "../../assets/icons/time.png"
import { ReactComponent as DropdownIcon } from "../../assets/icons/dropdown.svg"

import Ticket from "../Ticket"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { Api } from "../../api"
import getStore from "../../store"
import { eventHasTaxes, sumTaxes, sumTickets } from "../../utils/tb/taxes"
import { useNavigate } from "react-router-dom"
// import { clockdown } from "../../utils/tb/timer"

type Props = {
  hideEventData?: boolean
  datePeriod?: string
  ticketsList: TTicketDisposal[]
  setTickets?: (list: TTicketDisposal[]) => void
  onlyPurchasingItems?: boolean
  fitContainer?: boolean
}

const OrderResume = ({ hideEventData = false, datePeriod, ticketsList, onlyPurchasingItems = false, fitContainer = false }: Props) => {
  const navigate = useNavigate()

  const { event, controllers } = getStore()

  const [resumeExpanded, setResumeExpanded] = useState(false)

  const [taxes, setTaxes] = useState({
    value: 0,
    rule: "",
    strComplement: "",
  })
  const [ticketsTotal, setTicketsTotal] = useState(0)

  // const [time, setTime] = useState("15:00")

  const loadEventData = useCallback(async () => {
    if (event) {
      try {
        const req = await Api.get.eventInfo({ eventId: event?.id })

        if (req.ok) {
          const data = req.data
          sessionStorage.setItem("event", JSON.stringify(data))
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
      if (event) {
        const ticketsTotal = sumTickets(ticketsList)
        const taxesTotal = sumTaxes({
          chargeClient: event.eCommerce.chargeClient,
          ticketsTotal,
          adminTax: event.eCommerce.adminTax,
          adminTaxMinimum: +event.eCommerce.adminTaxMinimum,
          adminTaxPercentage: +event.eCommerce.adminTaxPercentage,
          adminTaxValue: +event.eCommerce.adminTaxValue,
          tickets: ticketsList,
        })

        setTaxes(taxesTotal)
        setTicketsTotal(ticketsTotal)
      }
    } catch (error) {
      alert("Erro ao carregar os tickets")
      navigate("/")
    }
  }

  /*
  const onTicketsTimeout = () => {
    navigate(-1)
  }

  const runTimer = () => {
    const timer = clockdown(900, onTicketsTimeout)

    timer.start()

    const interval = setInterval(() => {
      const time = timer.actualTime()
      if (time) setTime(time)
      else clearInterval(interval)
    }, 1000)
  }

  useEffect(() => {
    runTimer()
  }, []) */

  useEffect(() => {
    loadEventData()
  }, [loadEventData])

  useEffect(() => {
    sumValues()
  }, [ticketsList])

  const handleExpandResume = () => {
    setResumeExpanded(!resumeExpanded)
  }

  return (
    <S.Component $fitContainer={fitContainer}>
      {event?.event_banner && (
        <S.ImageContainer>
          <img src={event?.event_banner} alt={""} />
        </S.ImageContainer>
      )}

      <S.Info>
        <S.InfoWrapper $expanded={resumeExpanded}>
          <S.InfoData>
            <S.InfoContent>
              <S.EventResume $expanded={resumeExpanded}>
                <div onClick={handleExpandResume}>
                  <S.ResumeText>Resumo do pedido</S.ResumeText>
                  <DropdownIcon />
                </div>
                {!hideEventData && (
                  <div>
                    <S.DateText>Data</S.DateText>
                    <S.DateText>{datePeriod}</S.DateText>
                  </div>
                )}
              </S.EventResume>
              <S.TicketsList>
                {(onlyPurchasingItems ? ticketsList.filter(i => i.qnt > 0) : ticketsList).map((ticket, k) => (
                  <Ticket ticket={ticket} key={k} />
                ))}
              </S.TicketsList>
            </S.InfoContent>
          </S.InfoData>
        </S.InfoWrapper>
        <S.Total>
          <S.TotalItem>
            <span>Subtotal</span>
            <span>{formatMoney(ticketsTotal, true)}</span>
          </S.TotalItem>
          {event?.eCommerce.chargeClient && eventHasTaxes(event) && (
            <S.TotalItem>
              <span>Taxas {taxes.strComplement}</span>
              <span>{formatMoney(taxes.value, true)}</span>
            </S.TotalItem>
          )}
          <S.TotalItem $main={true}>
            <span>TOTAL</span>
            <span>{formatMoney(ticketsTotal + taxes.value, true)}</span>
          </S.TotalItem>
        </S.Total>
      </S.Info>

      {/* Release block */}
      {/* <S.ReleaseBlock>
        <S.RLeft>
          <img src={clockIcon} alt={""} />
          <span>{time}</span>
        </S.RLeft>
        <S.RRight>
          <span>
            Após este tempo, os ingressos serão liberados para venda novamente
          </span>
        </S.RRight>
      </S.ReleaseBlock> */}
    </S.Component>
  )
}

export default OrderResume
