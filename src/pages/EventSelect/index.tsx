import { useCallback, useEffect, useState } from "react"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import EventCard from "../../components/EventCard"

import { Api } from "../../api"
import { parseList } from "../../utils/tb/parseList"
import getStore from "../../store"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import loadingAnimation from "../../assets/animations/loading"
import { useNavigate } from "react-router-dom"
import { TOrganizer } from "../../utils/@types/data/organizer"

const EventSelect = () => {
  const store = getStore()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<any[]>([])

  const [organizerData, setOrganizerData] = useState<TOrganizer>()

  const getData = useCallback(async () => {
    setLoading(true)

    const events = await Api.get.events({})

    if (events.ok) {
      if (events.data.events && events.data.organizer) {
        setOrganizerData(events.data.organizer)
        const parsed = parseList.eventMinToEventCard(events.data.events)

        if (parsed.length > 1) setList(parsed)
        else if (parsed.length === 1) {
          try {
            const req = await Api.get.eventInfo({ eventId: parsed[0].id })

            if (req.ok) {
              sessionStorage.setItem("event", JSON.stringify(req.data))
              navigate("/")
            } else {
              alert(
                "Houve um erro ao selecionar o evento. Tente novamente mais tarde"
              )
            }
          } catch (error) {
            alert(
              "Houve um erro ao selecionar o evento. Tente novamente mais tarde"
            )
          }
        }
      } else {
        const message =
          "Houve um erro ao carregar as informações. Tente novamente mais tarde"
        alert(message)
      }
    } else {
      alert(events.error)
    }

    setLoading(false)
  }, [navigate])

  useEffect(() => {
    sessionStorage.removeItem("event")

    getData()
  }, [store.controllers, getData])

  return (
    <S.Page>
      <Header customData={organizerData} />

      <Container fullHeight={true}>
        <S.Main>
          <S.PageTitle>Eventos</S.PageTitle>

          {loading ? (
            <div style={{ width: 256, margin: "auto" }}>
              <DotLottieReact
                data={loadingAnimation}
                loop
                autoplay
                width={"100%"}
              />
            </div>
          ) : list.length === 0 ? (
            <S.PageTitle $align="center">
              Não há eventos ativos no momento
            </S.PageTitle>
          ) : (
            <S.List>
              {list.map((ticket, k) => (
                <EventCard k={k} key={k} data={ticket} />
              ))}
            </S.List>
          )}
        </S.Main>
      </Container>

      <Footer customData={organizerData} />
    </S.Page>
  )
}

export default EventSelect
