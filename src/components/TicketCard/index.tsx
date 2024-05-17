import * as S from "./styled"

import { Link } from "react-router-dom"

type Props = {
  data: {
    eventId: string
    eventBanner: string
    eventName: string
    eventDate: string
    ticketsQnt: string
  }
}

const TicketCard = ({ data }: Props) => {
  return (
    <S.Component>
      <Link
        to={data.eventId}
        state={{
          data,
        }}
      >
        <S.ImageContainer>
          <img src={data.eventBanner} alt={""} />
        </S.ImageContainer>
        <S.EventInfo>
          <S.EventName>{data.eventName}</S.EventName>
          <S.CardBottom>
            <S.EventDate>{data.eventDate}</S.EventDate>
            <S.TicketsQnt>Tickets: {data.ticketsQnt}</S.TicketsQnt>
          </S.CardBottom>
        </S.EventInfo>
      </Link>
    </S.Component>
  )
}

export default TicketCard
