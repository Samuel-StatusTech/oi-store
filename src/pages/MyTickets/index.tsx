import { useCallback, useEffect, useState } from "react"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"

import getStore from "../../store"
import { useNavigate } from "react-router-dom"
import TicketCard from "../../components/TicketCard"
import { Api } from "../../api"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import loadingAnimation from "../../assets/animations/loading"
import { TEventData } from "../../utils/@types/data/event"

const MyTickets = () => {
  const { controllers } = getStore()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<any[]>([])

  const getData = useCallback(async (eventInfo: any) => {
    setLoading(true)

    try {
      const req = await Api.get.myTickets({ eventId: eventInfo?.id as string, eventName: eventInfo?.name as string })

      if (req.ok) {
        const available = req.data.list.filter((i) => {
          let status = true

          if (i.payments.length > 0) {
            const payment = i.payments[0]
            const isPayed = payment.transition_id || payment.machine_data

            status = isPayed
          } else status = false

          return status
        })

        let updatedEventInfo: TEventData | null = null

        if (eventInfo) {
          const req2 = await Api.get.eventInfo({ eventId: eventInfo?.id })

          if (req2.ok) {
            const data = req2.data
            if (data.is_ecommerce) {
              controllers.event.setData(req2.data)
              updatedEventInfo = req2.data
              sessionStorage.setItem("event", JSON.stringify(req2.data))
            } else {
              controllers.event.clear()
              navigate("/eventSelect")
            }
          }
        }

        const newList = available.map((i) => ({
          ...i,
          eventBanner: (updatedEventInfo ?? eventInfo).event_banner as string,
          products: i.products.map((ip: any) => ({
            ...ip,
            TRN: i.payments[0].transition_id,
          })),
        }))

        const sortedList = newList
          .sort((a, b) => a.date.localeCompare(b.date))
          .reverse()

        setList(sortedList)
      } else {
      }
    } catch (error) {}

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem("token")

    if (token) {
      const eventData = sessionStorage.getItem("event")

      if (eventData) {
        getData(JSON.parse(eventData))
      } else {
        navigate("/eventSelect")
      }
    } else {
      navigate("/eventSelect")
    }
  }, [controllers.event, getData, navigate])

  return (
    <S.Page>
      <Header />

      <Container fullHeight={true}>
        <S.Main>
          <S.PageTitle>Meus ingressos</S.PageTitle>

          {loading ? (
            <div style={{ width: 256, margin: "0 auto" }}>
              <DotLottieReact
                data={loadingAnimation}
                loop
                autoplay
                width={"100%"}
              />
            </div>
          ) : list.length === 0 ? (
            <S.PageTitle $align="center">
              Você não possui ingressos para esse evento
            </S.PageTitle>
          ) : (
            <S.List>
              {list.map((ticket, k) => (
                <TicketCard k={k} key={k} data={ticket} />
              ))}
            </S.List>
          )}
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default MyTickets
