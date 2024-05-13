import * as S from "./styled"

import minus from "../../../assets/icons/minus.png"
import plus from "../../../assets/icons/plus.png"
import { formatMoney } from "../../../utils/tb/formatMoney"
import { TTicket } from "../../../utils/@types/ticket"

type Props = {
  ticket: TTicket
  changeQnt: (ticketId: number, action: "decrease" | "increase") => void
}

const Ticket = ({ ticket, changeQnt }: Props) => {
  return (
    <S.Component>
      <S.TicketInfo>
        <S.TicketName>{ticket.name}</S.TicketName>
        {ticket.price && (
          <S.TicketPrice>{formatMoney(ticket.price)}</S.TicketPrice>
        )}
      </S.TicketInfo>
      <S.Quantity>
        <S.QntControl>
          <S.Control onClick={() => changeQnt(ticket.id, "decrease")}>
            <img src={minus} alt={""} />
          </S.Control>
          <span>{ticket.qnt}</span>
          <S.Control onClick={() => changeQnt(ticket.id, "increase")}>
            <img src={plus} alt={""} />
          </S.Control>
        </S.QntControl>
      </S.Quantity>
    </S.Component>
  )
}

export default Ticket
