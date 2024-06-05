import { TCardTicket } from "../../utils/@types/data/ticket"
import * as S from "./styled"

import { Link } from "react-router-dom"

type Props = {
  data: TCardTicket
}

const TicketCard = ({ data }: Props) => {
  return (
    <S.Component>
      <Link
        to={data.name.toLowerCase().replace(/\s+/g, "-")}
        state={{
          data,
        }}
      >
        <S.ImageContainer>
          <img src={data.eventBanner} alt={""} />
        </S.ImageContainer>
        <S.EventInfo>
          <S.EventName>{data.name}</S.EventName>
          <S.CardBottom>
            <S.EventDate>{data.price_sell}</S.EventDate>
            <S.TicketsQnt>Tickets: {data.ticketsQnt}</S.TicketsQnt>
          </S.CardBottom>
        </S.EventInfo>
      </Link>
    </S.Component>
  )
}

export default TicketCard
