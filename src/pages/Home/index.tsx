/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import Header from "../../components/Header"
import * as S from "./styled"

import Container from "../../components/Container"
import BlockInfo from "../../components/BlockInfo"

import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"
import TicketsControl from "../../components/TicketsControl"
import Footer from "../../components/Footer"
import { Api } from "../../api"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { parseDisposalTickets } from "../../utils/tb/ticketsToDisposal"
import getStore from "../../store"
import { getDatePeriod, getHours } from "../../utils/tb/getDatePeriod"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  const { event, controllers } = getStore()
  const [tickets, setTickets] = useState<TTicketDisposal[]>([])

  const loadEventData = useCallback(async () => {
    if (event) {
      try {
        const req = await Api.get.eventInfo({ eventId: event?.id })

        if (req.ok) {
          const data = req.data
          controllers.event.setData(data)
        }
      } catch (error) {
        alert("Erro ao carregar os tickets")
      }
    } else navigate("/eventSelect")
  }, [])

  const fetchTickets = useCallback(async () => {
    if (event) {
      try {
        const req = await Api.get.products({ eventId: event?.id })

        if (req.ok) {
          const list = req.data.list
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
  }, [])

  const getPhone = () => {
    let str = ""

    str = event?.phone.replace(/(\d{2})(\d{4,5})(\d{4})/g, "($1) $2-$3") ?? ""

    return str
  }

  useEffect(() => {
    loadEventData()
    fetchTickets()
  }, [loadEventData, fetchTickets])

  return (
    <S.Page>
      <Header />
      <S.Hero>
        <img src={event?.event_banner} alt={""} className={"blured"} />
        <Container>
          <S.ImageContainer>
            <img src={event?.event_banner} alt={""} />
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
                  `${event?.address}`,
                  `${event?.city} - ${event?.uf}`,
                ]}
                icon={<img src={location} alt={""} width={84} />}
              />
            </S.Blocks>
          </S.MainData>

          <TicketsControl tickets={tickets} setTickets={setTickets} />
        </S.EventDataArea>
      </Container>

      <S.DescriptionWrapper>
        <Container>
          <S.DescriptionSection>
            <S.DescTitle>Descrição</S.DescTitle>
            <S.DescTexts
              dangerouslySetInnerHTML={{ __html: event?.description2 ?? "" }}
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

          <S.DescriptionSection>
            <S.DescTitle>Local</S.DescTitle>
            <S.DescText>{event?.local}</S.DescText>
            <S.DescText $bold={true}>Endereço</S.DescText>
            <S.DescSubText>{`${event?.address}`}</S.DescSubText>
            <S.DescSubText>{`${event?.city} - ${event?.uf}`}</S.DescSubText>
            <S.DescText $bold={true}>Telefone</S.DescText>
            <S.DescSubText>{getPhone()}</S.DescSubText>
          </S.DescriptionSection>
        </Container>
      </S.DescriptionWrapper>

      <Footer />
    </S.Page>
  )
}

export default Home
