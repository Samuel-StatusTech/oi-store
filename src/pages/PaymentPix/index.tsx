/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { TTicket } from "../../utils/@types/data/ticket"
import { temporizadorDeCincoMinutos } from "../../utils/tb/timer"
import { getDatePeriod, getHours } from "../../utils/tb/getDatePeriod"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import BlockInfo from "../../components/BlockInfo"
import Feedback from "../../components/Feedback"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import QRCode from "qrcode.react"
import loadingAnimation from "../../assets/animations/loading"

import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"
import getStore from "../../store"
import { Api } from "../../api"
import io from "socket.io-client"
import Popup from "../../components/PopUp"

const Payment = () => {
  const lctn = useLocation()
  const navigate = useNavigate()

  const { event, controllers } = getStore()

  const [time, setTime] = useState("05:00")

  const [tickets] = useState<TTicket[]>([
    {
      id: "id1",
      code: "ASF789FSDFS7",
      bucket: "TRN",
      group_name: "Ingressos",
      name: "Ticket teste",
      price_sell: "3500",
      status: "purchased",
    },
    {
      id: "id2",
      code: "Q789DS797HJK",
      bucket: "TRL",
      group_name: "Ingressos",
      name: "Ticket teste",
      price_sell: "3500",
      status: "purchased",
    },
    {
      id: "id3",
      code: "S9DASK09WQDK",
      bucket: "OPK",
      group_name: "Ingressos",
      name: "Ticket teste",
      price_sell: "3500",
      status: "purchased",
    },
    {
      id: "id4",
      code: "D909D90D90D9",
      bucket: "ABC",
      group_name: "Ingressos",
      name: "Ticket teste",
      price_sell: "3500",
      status: "purchased",
    },
  ])

  const [qrCode, setQrCode] = useState("")
  const [showing, setShowing] = useState(false)
  const [feedback, setFeedback] = useState<any>({
    visible: false,
    message: "",
  })

  const [payed, setPayed] = useState(false)

  const copyQRToClipboard = () => {
    try {
      navigator.clipboard.writeText(qrCode).then(() => {
        alert("Código copiado")
      })
    } catch (error) {}
  }

  const getOrderData = useCallback(() => {
    const tickets = (lctn.state.tickets as TTicket[]) ?? null
    const buyer = lctn.state.buyer ?? null

    if (tickets) {
      const paymentValue = tickets.reduce(
        (sum, ticket) => sum + +(ticket.price_sell ?? "0"),
        0
      )

      const phone = !!buyer.phone ? buyer.phone.replace(/\D/g, "") : null

      const obj = {
        customer: {
          name: buyer.name ?? "Lorem ipsum",
          email: "null@null.null",
          phones: phone
            ? [
                {
                  country: "55",
                  area: phone.slice(0, 2),
                  number: phone.slice(2),
                  type: "MOBILE",
                },
              ]
            : undefined,
          tax_id: "12345678909",
        },
        items: tickets.map((t) => ({
          name: t.name,
          quantity: 1,
          unit_amount: +(t.price_sell ?? "0"),
        })),
        qr_codes: [
          { amount: { value: paymentValue, arrangements: "PAGBANK" } },
        ],
        notification_urls: [
          "https://back-moreira.vercel.app/api/orders/orderUpdate",
        ],
      }

      return obj
    } else return null
  }, [lctn.state.buyer, lctn.state.tickets])

  const returnPage = () => {
    navigate(-1)
  }

  const instanceSocket = () => {
    // const paymentValue = ((lctn.state.tickets as TTicket[]) ?? []).reduce(
    //   (sum, ticket) => sum + +(ticket.price_sell ?? "0"),
    //   0
    // )

    const socket = io("https://back-moreira.vercel.app", {
      autoConnect: true,
      reconnectionAttempts: 3,
    })

    socket.on("connection", (socket) => {
      console.log("HERE", socket.id)
    })

    socket.on("disconnect", () => {
      alert("Ops, houve um erro. Tente novamente mais tarde")
      navigate(-1)
      return
    })

    // let f = { ...feedback }
    let f = {
      state: "PAID",
      visible: true,
      message: "Pagamento recebido. Você já pode ver sua compra",
    }

    // socket.on("orderUpdate", (data) => {
    // console.log("Here", data, paymentValue)

    // if (data.amount === paymentValue) {
    // f = { ...data, visible: true }

    // if (data.state === 'EXPIRED') {
    //   getOrderData()
    //   instanceSocket()
    // }

    setTimeout(() => {
      setFeedback(f)

      setTimeout(() => {
        setFeedback({ ...f, visible: false })
        setTimeout(() => {
          setPayed(true)
        }, 400)
      }, 3500)
    }, 4000)
    // }

    // monitor minors payments ?
    // })

    return socket
  }

  const getPBcode = useCallback(async () => {
    if (!lctn.state.tickets) return returnPage()
    else {
      const orderData = getOrderData()
      if (orderData) {
        const socket = instanceSocket()

        const req = await Api.get.qrcode({
          order: { ...orderData, reference_id: socket.id },
        })

        if (req.ok) {
          setQrCode(req.data.qr_codes[0].text)

          runTimer()
        } else {
          alert(req.error)
        }
      }
    }
  }, [])

  const runTimer = () => {
    const timer = temporizadorDeCincoMinutos()

    timer.iniciar()

    setInterval(() => {
      setTime(timer.tempoAtualFormatado())
    }, 1000)
  }

  const loadEventData = useCallback(async () => {
    if (event) {
      try {
        const req = await Api.get.eventInfo({ eventId: event?.id })

        if (req.ok) {
          const data = req.data
          controllers.event.setData(data)
        } else {
          alert("Erro ao carregar as informações do evento")
          navigate("/")
        }
      } catch (error) {
        alert("Erro ao carregar as informações do evento")
        navigate("/")
      }
    } else navigate("/")
  }, [])

  useEffect(() => {
    loadEventData()
    getPBcode()
  }, [loadEventData, getPBcode])

  return (
    <S.Page>
      <Feedback data={feedback} />
      <Header />

      <Popup
        tickets={tickets}
        showing={showing}
        closeFn={() => setShowing(false)}
      />

      <Container>
        <S.Main>
          <S.Block>
            <S.BlockTitle>Pedido iniciado</S.BlockTitle>

            <S.EventInfo>
              {event?.event_banner && (
                <img src={event?.event_banner} alt={""} />
              )}

              <div className="eventInfos">
                <S.BlockTitle>{event?.name}</S.BlockTitle>
                <BlockInfo
                  small={true}
                  icon={<img src={calendar} alt={""} width={40} />}
                  description={[
                    event?.date_ini && event?.date_end
                      ? getDatePeriod(
                          event?.date_ini as string,
                          event?.date_end as string
                        )
                      : "",
                    event?.time_ini
                      ? event?.date_ini
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
                        : "Dia todo"
                      : event?.date_ini && event?.date_end
                      ? "Dia todo"
                      : "",
                  ]}
                />
                <BlockInfo
                  small={true}
                  icon={<img src={location} alt={""} width={40} />}
                  description={[
                    `${event?.address ?? ""}`,
                    `${event?.city ?? ""}${event?.uf ? ` - ${event?.uf}` : ""}`,
                  ]}
                />
              </div>
            </S.EventInfo>
          </S.Block>

          <S.Block>
            <S.BlockTitle>
              {payed
                ? "Veja os detalhes do seu pedido:"
                : "Agora só falta concluir o seu Pix."}
            </S.BlockTitle>

            {payed ? (
              <S.Button $content={true} onClick={() => setShowing(true)}>
                Abrir pedido
              </S.Button>
            ) : (
              <S.PixArea>
                <S.PixInstructions>
                  <span>
                    Utilize o <strong>código</strong> a seguir para realizar o
                    pagamento pelo <strong>aplicativo do seu banco</strong>
                  </span>
                </S.PixInstructions>
                <S.QR>
                  {qrCode ? (
                    <>
                      {qrCode && <QRCode value={qrCode} renderAs="svg" />}

                      <S.Button onClick={copyQRToClipboard}>
                        Copiar código
                      </S.Button>
                    </>
                  ) : (
                    <div style={{ width: 256 }}>
                      <DotLottieReact
                        data={loadingAnimation}
                        loop
                        autoplay
                        width={"100%"}
                      />
                    </div>
                  )}
                </S.QR>
                <S.PixTime>
                  <span>
                    Você tem <strong>{time}</strong> para realizar o pagamento
                  </span>
                </S.PixTime>
              </S.PixArea>
            )}
          </S.Block>
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default Payment
