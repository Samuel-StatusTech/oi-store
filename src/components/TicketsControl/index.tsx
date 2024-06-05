import { useState } from "react"
import * as S from "./styled"
import Ticket from "../Ticket"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { formatMoney } from "../../utils/tb/formatMoney"
import { useNavigate } from "react-router-dom"

import { DatePicker } from "@mui/x-date-pickers"

type Props = {
  tickets: TTicketDisposal[]
  setTickets: (list: TTicketDisposal[]) => void
}

const daysRelation = ["D", "S", "T", "Q", "Q", "S", "S"]

const TicketsControl = ({ tickets, setTickets }: Props) => {
  const navigate = useNavigate()

  const [installment] = useState(10)

  const calcTotal = () => {
    let val = tickets.reduce((qnt, tk) => qnt + tk.price_sell * tk.qnt, 0)

    return formatMoney(val)
  }

  const changeQnt = (
    ticketId: number | string,
    action: "decrease" | "increase"
  ) => {
    let nList = [...tickets]

    const tk = nList.find((t) => t.id === ticketId) as TTicketDisposal

    if (action === "decrease") {
      if (tk.qnt > 0) {
        nList = nList.map((tkt) =>
          tkt.id !== tk.id
            ? tkt
            : {
                ...tkt,
                qnt: tk.qnt - 1,
              }
        )
      }
    } else if (action === "increase") {
      if (tk.qnt + 1 <= tk.quantity) {
        nList = nList.map((tkt) =>
          tkt.id !== tk.id
            ? tkt
            : {
                ...tkt,
                qnt: tk.qnt + 1,
              }
        )
      }
    }

    setTickets(nList)
  }

  const handleBuy = () => {
    navigate("/payment", {
      state: { tickets },
    })
  }

  return (
    <S.Component>
      <S.Top>
        <span>Ingressos</span>
      </S.Top>
      <S.DateArea>
        <span>Selecione uma data</span>
        <DatePicker
          dayOfWeekFormatter={(d) => {
            return daysRelation[d.getDay()]
          }}
          disablePast={true}
          sx={{
            ".MuiInputBase-root > input": {
              padding: ".6rem .8rem",
            },
          }}
        />
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
