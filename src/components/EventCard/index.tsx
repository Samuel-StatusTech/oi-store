import { Api } from "../../api"
import getStore from "../../store"
import { TCardEvent } from "../../utils/@types/data/eventCard"
import * as S from "./styled"

import { Link, useNavigate } from "react-router-dom"

type Props = {
  data: TCardEvent
  k: number
}

const EventCard = ({ k, data }: Props) => {
  const store = getStore()
  const navigate = useNavigate()

  const setEvent = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault()

    try {
      const req = await Api.get.eventInfo({ eventId: data.id })

      if (req.ok) {
        store.controllers.event.setData(req.data)
        navigate("/")
      } else {
        alert(
          "Houve um erro ao selecionar o evento. Tente novamente mais tarde"
        )
      }
    } catch (error) {
      alert("Houve um erro ao selecionar o evento. Tente novamente mais tarde")
    }
  }

  return (
    <S.Component $k={k}>
      <Link onClick={setEvent} to={"/"}>
        <S.ImageContainer>
          <img src={data.banner ?? ""} alt={""} />
        </S.ImageContainer>
        <S.EventInfo>
          <S.EventName>{data.name}</S.EventName>
          <S.CardBottom>
            <S.EventDate>{data.dateStr}</S.EventDate>
          </S.CardBottom>
        </S.EventInfo>
      </Link>
    </S.Component>
  )
}

export default EventCard
