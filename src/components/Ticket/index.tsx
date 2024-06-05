import * as S from "./styled"

import minus from "../../assets/icons/minus.png"
import plus from "../../assets/icons/plus.png"
import { formatMoney } from "../../utils/tb/formatMoney"
import { TTicketDisposal } from "../../utils/@types/data/ticket"

type Props = {
  ticket: TTicketDisposal
  changeQnt?: (
    ticketId: number | string,
    action: "decrease" | "increase"
  ) => void
  hasControl?: boolean
}

const Ticket = ({ ticket, changeQnt, hasControl = true }: Props) => {
  return (
    <S.Component>
      <S.TicketInfo>
        <S.TicketName>{ticket.name}</S.TicketName>
        {ticket.price_sell && (
          <S.TicketPrice>{formatMoney(ticket.price_sell)}</S.TicketPrice>
        )}
      </S.TicketInfo>
      <S.Quantity>
        <S.QntControl>
          {hasControl && changeQnt && (
            <S.Control onClick={() => changeQnt(ticket.id, "decrease")}>
              <img src={minus} alt={""} />
            </S.Control>
          )}
          <span>{ticket.qnt}</span>
          {hasControl && changeQnt && (
            <S.Control onClick={() => changeQnt(ticket.id, "increase")}>
              <img src={plus} alt={""} />
            </S.Control>
          )}
        </S.QntControl>
      </S.Quantity>
    </S.Component>
  )
}

export default Ticket
