/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"

import getStore from "../../store"
import { useLocation, useNavigate, useNavigationType } from "react-router-dom"
import TicketCard from "../../components/TicketCard"
import { Api } from "../../api"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import loadingAnimation from "../../assets/animations/loading"
import { TEventData } from "../../utils/@types/data/event"

const MyTickets = () => {
  const { controllers, user, event } = getStore()

  const lctn = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    if (navigationType === "POP") {
      if (lctn.state?.backRoute) {
        navigate(lctn.state.backRoute, { replace: true })
      }
    }
  }, [navigationType])

  const getData = useCallback(async (eventInfo: any) => {
    setLoading(true)

    try {
      const req = await Api.get.myTickets({
        eventId: eventInfo?.id as string,
        eventName: eventInfo?.name as string,
      })

      if (req.ok) {
        const available = req.data.list.filter((i) => {
          let status = true

          if (i.payments.length > 0) {
            const payment = i.payments[0]
            const isPayed =
              payment.transition_code ||
              payment.machine_data ||
              i.status === "validado" ||
              i.status === "cancelamento"

            status = isPayed
          } else status = false

          return status
        })

        let updatedEventInfo: TEventData | null = null

        if (eventInfo) {
          const req2 = await Api.get.eventInfo({ eventId: eventInfo?.id })

          if (req2.ok) {
            const data = req2.data
            if (Boolean(data.is_ecommerce)) {
              controllers.event.setData(req2.data)
              updatedEventInfo = req2.data
              localStorage.setItem("event", JSON.stringify(req2.data))
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
            TRN: i.extref,
          })),
        }))

        const sortedList = newList.sort((a, b) => {
          const aTime = new Date(a.date).getTime()
          const bTime = new Date(b.date).getTime()

          if (
            !Number.isNaN(aTime) &&
            !Number.isNaN(new Date(b.date).getTime())
          ) {
            return aTime > bTime ? -1 : 1
          } else return 0
        })

        setList(sortedList)
      } else {
      }
    } catch (error) {}

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!!user) {
      const eventData = localStorage.getItem("event")

      if (eventData) {
        getData(JSON.parse(eventData))
      } else {
        navigate("/eventSelect")
      }
    } else {
      navigate("/eventSelect")
    }
  }, [controllers.event, getData, navigate, user])

  const renderEventDate = () => {
    if (event) {
      const iniDate = new Date(event.date_ini)
      const endDate = new Date(event.date_end)

      const finalIniDate = iniDate.getUTCDate()
      const finalIniMonth = String(iniDate.getUTCMonth() + 1).padStart(2, "0")
      const finalIniYear = iniDate.getUTCFullYear()

      const finalEndDate = endDate.getUTCDate()
      const finalEndMonth = String(endDate.getUTCMonth() + 1).padStart(2, "0")
      const finalEndYear = endDate.getUTCFullYear()

      const formattedIniDate = `${finalIniDate}/${finalIniMonth}/${finalIniYear}`
      const formattedEndDate = `${finalEndDate}/${finalEndMonth}/${finalEndYear}`

      const eventDateText =
        event.date_end === event.date_ini
          ? formattedIniDate
          : `${formattedIniDate} até ${formattedEndDate}`

      return eventDateText
    }
  }

  return (
    <S.Page>
      <Header />

      <Container fullHeight={true}>
        <S.Main>
          <S.PageTitle>Meus ingressos</S.PageTitle>
          <S.PageSubTitle>Data do evento: {renderEventDate()}</S.PageSubTitle>

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
