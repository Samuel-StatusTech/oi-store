import * as S from "./styled"
import Ticket from "../Ticket"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { formatMoney } from "../../utils/tb/formatMoney"
import { useNavigate } from "react-router-dom"

type Props = {
  tickets: TTicketDisposal[]
  setTickets: (list: TTicketDisposal[]) => void
}

const TicketsControl = ({ tickets, setTickets }: Props) => {
  const navigate = useNavigate()

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
    window.scrollTo({ top: 0 })
  }

  return (
    <S.Component>
      <S.Top>
        <span>Ingressos</span>
      </S.Top>
      <S.Tickets>
        {tickets.map((t, k) => (
          <Ticket k={k} key={k} ticket={t} changeQnt={changeQnt} />
        ))}
      </S.Tickets>
      <S.Bottom>
        <S.Resume>
          <S.Total>{`Total ${calcTotal()}`}</S.Total>
        </S.Resume>
        <S.BuyBtn
          onClick={tickets.every((t) => t.qnt === 0) ? undefined : handleBuy}
          disabled={tickets.every((t) => t.qnt === 0)}
        >
          Comprar
        </S.BuyBtn>
      </S.Bottom>
    </S.Component>
  )
}

export default TicketsControl
