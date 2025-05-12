import { useEffect, useState } from "react"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import * as S from "./styled"
import { formatMoney } from "../../utils/tb/formatMoney"
import Ticket from "../Ticket"

type Props = {
  data: TTicketDisposal[]
  k: number
  changeQnt: (
    ticketId: number | string,
    action: "decrease" | "increase"
  ) => void
}

const TicketsGroup = ({ k, data, changeQnt }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const [tickets, setTickets] = useState<TTicketDisposal[]>([])

  useEffect(() => {
    if (Array.isArray(data)) setTickets(data)
  }, [data])

  const getLowerPrice = () => {
    let lower = 0

    tickets.forEach((t) => {
      if (lower !== 0) {
        if (t.price_sell < lower) lower = t.price_sell
      } else lower = t.price_sell
    })

    return formatMoney(lower, true)
  }

  return (
    <S.Component $k={k}>
      <S.Item>
        <S.GroupInfo onClick={() => setExpanded(!expanded)}>
          <S.GroupInfoMain>
            <S.GroupName>Nome do grupo</S.GroupName>
          </S.GroupInfoMain>
          <S.GroupInfoSecondary>
            <S.GroupBasePrice>
              A partir de <strong>{getLowerPrice()}</strong>
            </S.GroupBasePrice>
          </S.GroupInfoSecondary>
        </S.GroupInfo>
        <S.ListWrapper $opened={expanded}>
          <S.ListArea>
            <S.List>
              {tickets.map((t, k) => (
                <Ticket k={k} key={k} ticket={t} changeQnt={changeQnt} />
              ))}
            </S.List>
          </S.ListArea>
        </S.ListWrapper>
      </S.Item>
    </S.Component>
  )
}

export default TicketsGroup
