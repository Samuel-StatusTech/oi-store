import { useState } from "react"
import * as S from "./styled"
import Ticket from "../Ticket"
import { TTicketDisposal } from "../../utils/@types/ticket"
import { formatMoney } from "../../utils/tb/formatMoney"
import { useNavigate } from "react-router-dom"

const TicketsControl = () => {
  const navigate = useNavigate()

  const [installment] = useState(10)
  const [tickets, setTickets] = useState<TTicketDisposal[]>([
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

  const calcTotal = () => {
    let val = tickets.reduce((qnt, tk) => qnt + tk.price * tk.qnt, 0)

    return formatMoney(val)
  }

  const changeQnt = (
    ticketId: number | string,
    action: "decrease" | "increase"
  ) => {
    let nList = [...tickets]

    const tk = nList.find((t) => t.id === ticketId) as TTicketDisposal

    if (action === "decrease") {
      if (tk.qnt > 1) {
        nList = nList.map((tkt) =>
          tkt.id !== tk.id
            ? tkt
            : {
                ...tkt,
                qnt: tk.qnt - 1,
              }
        )
      } else nList = nList.filter((t) => t.id !== ticketId)
    } else if (action === "increase") {
      nList = nList.map((tkt) =>
        tkt.id !== tk.id
          ? tkt
          : {
              ...tkt,
              qnt: tk.qnt + 1,
            }
      )
    }

    setTickets(nList)
  }

  const handleBuy = () => {
    navigate("/payment")
  }

  return (
    <S.Component>
      <S.Top>
        <span>Ingressos</span>
      </S.Top>
      <S.DateArea>
        <span>Selecione uma data</span>
      </S.DateArea>
      <S.Tickets>
        {tickets.map((t, k) => (
          <Ticket key={k} ticket={t} changeQnt={changeQnt} />
        ))}
      </S.Tickets>
      <S.Bottom>
        <S.Resume>
          <S.Total>{`Total ${calcTotal()}`}</S.Total>
          <S.Installments>{`Pague em até ${installment}x`}</S.Installments>
        </S.Resume>
        <S.BuyBtn onClick={handleBuy}>Comprar</S.BuyBtn>
      </S.Bottom>
    </S.Component>
  )
}

export default TicketsControl
