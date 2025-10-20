/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import Header from "../../components/Header"
import * as S from "./styled"

import Container from "../../components/Container"
import BlockInfo from "../../components/BlockInfo"

import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"
import userSafety from "../../assets/icons/user-safety.png"

import TicketsControl from "../../components/TicketsControl"
import Footer from "../../components/Footer"
import { Api } from "../../api"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { parseDisposalTickets } from "../../utils/tb/ticketsToDisposal"
import getStore from "../../store"
import { getDatePeriod, getHours } from "../../utils/tb/getDatePeriod"
import { useNavigate } from "react-router-dom"
import { TEventData } from "../../utils/@types/data/event"
import { parseEmojis } from "../../utils/tb/text"

const Home = () => {
  const navigate = useNavigate()

  const eventData = sessionStorage.getItem("event")

  const event = eventData ? (JSON.parse(eventData) as TEventData) : null

  const { controllers } = getStore()

  const [tickets, setTickets] = useState<TTicketDisposal[]>([])
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([])

  const loadEventData = async () => {
    if (event) {
      try {
        const req = await Api.get.eventInfo({ eventId: event?.id })

        if (req.ok) {
          const data = req.data
          if (data.is_ecommerce) {
            controllers.event.setData(req.data)
            sessionStorage.setItem("event", JSON.stringify(req.data))
          } else {
            controllers.event.clear()
            navigate("/eventSelect")
          }
        }
      } catch (error) {
        alert("Erro ao carregar os tickets")
      }
    } else navigate("/eventSelect")
  }

  const fetchTickets = async () => {
    if (event) {
      try {
        const req = await Api.get.products({ eventId: event?.id })

        if (req.ok) {
          const list = req.data.list

          let groupsList: { id: string; name: string }[] = []

          list.forEach((i) => {
            if (groupsList.every((g) => g.id !== i.group_id))
              groupsList.push({
                id: i.group_id,
                name: i.group_name,
              })
          })

          setGroups(groupsList)

          const parsedTickets = parseDisposalTickets(
            list.filter((t) =>
              t.active !== undefined ? (Boolean(t.active) ? t : null) : t
            )
          )

          setTickets(parsedTickets)
        }
      } catch (error) {
        alert("Erro ao carregar os tickets")
      }
    }
  }

  useEffect(() => {
    localStorage.removeItem("payed")
    if (event) {
      loadEventData()
      if (tickets.length === 0) fetchTickets()
    }
  }, [])

  return (
    <S.Page>
      <Header />
      <S.Hero>
        <img src={event?.event_banner} alt={""} className={"blured"} />
        <Container>
          <S.ImageContainer $hasBanner={!!event?.event_banner} $hasVerticalBanner={!!event?.event_banner_vertical}>
            <img src={event?.event_banner} alt={""} className={`event_banner_vertical`} />
            <img src={event?.event_banner_vertical} alt={""} className={`event_banner`} />
          </S.ImageContainer>
        </Container>
      </S.Hero>

      <Container>
        <S.EventDataArea>
          <S.MainData>
            <S.EventName>{event?.name}</S.EventName>
            <S.Blocks>
              <BlockInfo
                k={3}
                title="Data e Hora"
                description={[
                  getDatePeriod(
                    event?.date_ini as string,
                    event?.date_end as string
                  ),
                  event?.date_ini
                    ? getHours(
                        new Date(
                          event?.date_ini.slice(
                            0,
                            event?.date_ini.indexOf("T")
                          ) +
                            "T" +
                            event?.time_ini +
                            ".000Z"
                        )
                      )
                    : event?.time_ini
                    ? event.time_ini.slice(0, 5)
                    : "Dia todo",
                ]}
                icon={<img src={calendar} alt={""} width={84} />}
              />
              <BlockInfo
                k={4}
                title="Localização"
                description={[
                  `${event?.local}. ${event?.address}`,
                  `${event?.city} - ${event?.uf}`,
                ]}
                icon={<img src={location} alt={""} width={84} />}
              />
            </S.Blocks>
            {Boolean(event?.has_age) && (
              <S.Blocks className="additional">
                <BlockInfo
                  title="Informações adicionais"
                  description={["Faixa etária", String(event?.age)]}
                  icon={
                    <img
                      src={userSafety}
                      className="userSafety"
                      alt={""}
                      height={48}
                      width={48}
                    />
                  }
                />
              </S.Blocks>
            )}
          </S.MainData>


          <TicketsControl
            showByGroup={groups.length > 1}
            groups={groups}
            tickets={tickets}
            setTickets={setTickets}
          />
        </S.EventDataArea>
      </Container>

      <S.DescriptionWrapper>
        <Container>
          <S.DescriptionSection>
            <S.DescTitle>Descrição</S.DescTitle>
            <S.DescTexts
              dangerouslySetInnerHTML={{
                __html: event?.description2
                  ? parseEmojis(event?.description2)
                  : "",
              }}
            />
          </S.DescriptionSection>

          {event?.event_map ? (
            <>
              <S.DescTitle>Mapa do evento</S.DescTitle>
              <S.MapEvent src={event?.event_map} alt={""} />
            </>
          ) : (
            <></>
          )}
        </Container>
      </S.DescriptionWrapper>

      <Footer />
    </S.Page>
  )
}

export default Home
