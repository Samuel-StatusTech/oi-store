/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import Header from "../../components/Header"
import * as S from "./styled"

import Container from "../../components/Container"
import BlockInfo from "../../components/BlockInfo"

import example from "../../assets/images/exemplo.jpg"
import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"
import TicketsControl from "../../components/TicketsControl"
import Footer from "../../components/Footer"
import { Api } from "../../api"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { parseDisposalTickets } from "../../utils/tb/ticketsToDisposal"
import getStore from "../../store"
import { getDatePeriod } from "../../utils/tb/getDatePeriod"
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
    } else navigate("/")
  }, [])

  const fetchTickets = useCallback(async () => {
    if (event) {
      try {
        const req = await Api.get.products({ eventId: event?.id })

        if (req.ok) {
          const list = req.data.list
          setTickets(parseDisposalTickets(list))
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
        <img src={example} alt={""} className={"blured"} />
        <Container>
          <S.ImageContainer>
            <img src={example} alt={""} />
          </S.ImageContainer>
        </Container>
      </S.Hero>

      <Container>
        <S.EventDataArea>
          <S.MainData>
            <S.EventName>{event?.name}</S.EventName>
            <S.Blocks>
              <BlockInfo
                title="Data e Hora"
                description={[
                  getDatePeriod(
                    event?.date_ini as string,
                    event?.date_end as string
                  ),
                  event?.time_ini ? event.time_ini.slice(0, 5) : "Dia todo",
                ]}
                icon={<img src={calendar} alt={""} width={84} />}
              />
              <BlockInfo
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
              dangerouslySetInnerHTML={{ __html: event?.description ?? "" }}
            />
          </S.DescriptionSection>
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
      {/* 
      <Container>
        <S.Organizers>
          <Organizer
            icon={
              "https://static.vecteezy.com/system/resources/previews/012/871/371/original/google-search-icon-google-product-illustration-free-png.png"
            }
            name={"GR Produções, Shows e Eventos!"}
            phone={"(38) 99221-6176"}
            description={[
              "GR Produções, Shows e Eventos!",
              "Eventos com qualidade e segurança!",
            ]}
          />
        </S.Organizers>
      </Container> */}

      <Footer />
    </S.Page>
  )
}

export default Home
