import { useEffect, useState } from "react"
import { formatMoney } from "../../utils/tb/formatMoney"
import * as S from "./styled"

import eventLogo from "../../assets/images/exemplo.png"
import clockIcon from "../../assets/icons/time.png"

import Ticket from "../Ticket"

const OrderResume = () => {
  const [ticketsList] = useState([
    {
      id: 1,
      name: "Off Feminino + 1 Caipirinha até 22hrs",
      price: 6000,
      qnt: 1,
      availability: 0,
    },
    {
      id: 2,
      name: "Feminino",
      price: 4000,
      qnt: 2,
    },
    {
      id: 3,
      name: "Masculino",
      price: 10000,
      qnt: 1,
    },
    {
      id: 4,
      name: "Mesa",
      price: 35000,
      qnt: 1,
    },
  ])
  const [event, setEvent] = useState<any>(null)

  useEffect(() => {
    setEvent({
      image: eventLogo,
    })
  }, [])

  return (
    <S.Component>
      <S.ImageContainer>
        <img src={event?.image} alt={""} />
      </S.ImageContainer>

      <S.Info>
        <S.EventResume>
          <S.ResumeText>Resumo do pedido</S.ResumeText>
          <div style={{ display: "flex" }}>
            <S.DateText>Data</S.DateText>
            <S.DateText>14 de dezembro de 2022</S.DateText>
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
            <span>{formatMoney(10000, true)}</span>
          </S.TotalItem>
          <S.TotalItem>
            <span>Taxas</span>
            <span>{formatMoney(0, true)}</span>
          </S.TotalItem>
          <S.TotalItem $main={true}>
            <span>TOTAL</span>
            <span>{formatMoney(10000, true)}</span>
          </S.TotalItem>
        </S.Total>
      </S.Info>

      {/* Release block */}
      <S.ReleaseBlock>
        <S.RLeft>
          <img src={clockIcon} alt={""} />
          <span>15:00</span>
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
