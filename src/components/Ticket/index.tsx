import * as S from "./styled"

import minus from "../../assets/icons/minus.png"
import plus from "../../assets/icons/plus.png"
import { formatMoney } from "../../utils/tb/formatMoney"
import { TTicketDisposal } from "../../utils/@types/data/ticket"

type Props = {
  k?: number
  ticket: TTicketDisposal
  changeQnt?: (
    ticketId: number | string,
    action: "decrease" | "increase"
  ) => void
  hasControl?: boolean
}

const Ticket = ({ k, ticket, changeQnt, hasControl = true }: Props) => {
  return (
    <S.Component $k={k}>
      <S.TicketInfo>
        <S.TicketName>{ticket.name}</S.TicketName>
        {ticket.price_sell && (
          <S.TicketPrice>{formatMoney(ticket.price_sell)}</S.TicketPrice>
        )}
      </S.TicketInfo>
      <S.Quantity $saledOut={ticket.quantity === 0}>
        {ticket.quantity === 0 ? (
          <span style={{ width: "100%", maxWidth: 120, textAlign: "center" }}>
            <strong>Esgotado</strong>
          </span>
        ) : (
          <S.QntControl>
            {hasControl && changeQnt && (
              <S.Control
                $disabled={ticket.qnt === 0}
                onClick={() => changeQnt(ticket.id, "decrease")}
              >
                <img src={minus} alt={""} />
              </S.Control>
            )}
            <span>{ticket.qnt}</span>
            {hasControl && changeQnt && (
              <S.Control
                $disabled={ticket.quantity - ticket.qnt < 1 || ticket.qnt >= 20}
                onClick={
                  ticket.quantity - ticket.qnt < 1 || ticket.qnt >= 20
                    ? () => {}
                    : () => changeQnt(ticket.id, "increase")
                }
              >
                <img src={plus} alt={""} />
              </S.Control>
            )}
          </S.QntControl>
        )}
      </S.Quantity>
    </S.Component>
  )
}

export default Ticket
