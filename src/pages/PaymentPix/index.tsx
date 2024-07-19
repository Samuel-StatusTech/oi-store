/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { TShoppingTicket, TTicket } from "../../utils/@types/data/ticket"
import { temporizadorDeCincoMinutos } from "../../utils/tb/timer"
import { getDatePeriod, getHours } from "../../utils/tb/getDatePeriod"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import BlockInfo from "../../components/BlockInfo"
import Feedback from "../../components/Feedback"

import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import QRCode from "qrcode.react"
import loadingAnimation from "../../assets/animations/loading"

import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"
import getStore from "../../store"
import { Api, baseBackUrl } from "../../api"
import io from "socket.io-client"
import { getOrderData } from "../../utils/tb/order"
import downloadTickets from "../../utils/pdf"

const PaymentPix = () => {
  const lctn = useLocation()
  const navigate = useNavigate()

  const timer = temporizadorDeCincoMinutos()

  const { event, controllers } = getStore()

  const [time, setTime] = useState("05:00")
  const [sid, setSid] = useState("")

  const [buyedTickets, setBuyedTickets] = useState<TShoppingTicket[]>([])

  const [qrCode, setQrCode] = useState("")
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        timer.atualizarTempo()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const returnPage = () => {
    navigate(-1)
  }

  const instanceSocket = async () => {
    const socket = io(baseBackUrl, {
      autoConnect: true,
      reconnectionAttempts: 3,
    })

    return socket
  }

  const getPBcode = useCallback(async () => {
    if (!lctn.state.tickets || !lctn.state.buyer) return returnPage()
    else {
      const orderData = getOrderData({
        tickets: lctn.state.tickets,
        buyer: lctn.state.buyer,
        taxTotal: lctn.state.taxTotal ?? 0,
      })

      if (orderData) {
        const socket = await instanceSocket()

        socket.on("connection", (socket) => {
          setSid(socket.id)
        })

        socket.on("orderUpdate", async (data) => {
          const paymentValue =
            ((lctn.state.tickets as TTicket[]) ?? []).reduce(
              (sum, ticket) => sum + +(ticket.price_sell ?? "0"),
              0
            ) + lctn.state.taxTotal

          if (data.amount === paymentValue) {
            // confirm purchase
            const purchase = await confirmPurchase(data.orderId, data.code)

            if (purchase.ok) {
              let f = {
                state: data.status,
                visible: true,
                message: data.message,
              }

              if (data.status === "EXPIRED") {
                getOrderData({
                  tickets: lctn.state.tickets,
                  buyer: lctn.state.buyer,
                  taxTotal: lctn.state.taxTotal ?? 0,
                })
                socket.disconnect()
                instanceSocket()
              }

              setFeedback(f)

              setTimeout(() => {
                setFeedback({ ...f, visible: false })
                setTimeout(() => {
                  setPayed(true)
                }, 400)
              }, 3500)
            }

            socket.on("connect_error", (err) => {
              alert("Ops, houve um erro. Tente novamente mais tarde")
              navigate(-1)
              return
            })
          }
        })

        socket.on("connect_error", (err) => {
          socket.connect()
          return
        })

        const req = await Api.get.qrcode({
          order: { ...orderData, reference_id: socket.id },
        })

        if (req.ok) {
          setQrCode(req.data.qr_codes[0].text)
          runTimer()
        } else {
          alert(req.error)
          navigate(-1)
        }
      }
    }
  }, [])

  const runTimer = () => {
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
          navigate("/eventSelect")
        }
      } catch (error) {
        alert("Erro ao carregar as informações do evento")
        navigate("/eventSelect")
      }
    } else navigate("/eventSelect")
  }, [])

  const signPurchase = useCallback(() => {
    let pdfTickets: TShoppingTicket[] = []

    const tickets = (lctn.state.tickets ?? []) as any[]

    tickets.forEach((t) => {
      pdfTickets.push({
        id: t.id,
        name: t.name,
        batch_name: "Nome do lote",
        event_name: event?.name as string,
        qr_data: (t.id as string).toUpperCase(),
        order_id: sid,
        date: new Date().toISOString(),
        image: null,
        quantity: t.qnt,
        price_unit: t.price_sell,
      })
    })

    setBuyedTickets(pdfTickets)
  }, [])

  const confirmPurchase = async (
    orderId: string,
    code: string
  ): Promise<{ ok: boolean }> => {
    const params: any = {
      eventId: event?.id as string,
      orderId,
      paymentCode: code,
    }

    return new Promise(async (resolve) => {
      try {
        await Api.post.order.confirm(params)

        resolve({ ok: true })
      } catch (error) {
        resolve({ ok: false })
      }
    })
  }

  useEffect(() => {
    window.scrollTo({ top: 0 })

    try {
      loadEventData()

      // sign purchase
      signPurchase()
      // get qr_code
      getPBcode()
    } catch (error) {}
  }, [loadEventData, getPBcode])

  const handleDownload = async () => {
    if (event) await downloadTickets(event, buyedTickets, true)
  }

  const handleShare = async () => {
    try {
      if (event) {
        const file = await downloadTickets(event, buyedTickets)

        if (file instanceof File) {
          const data = {
            title: `Meus Tickets para ${event.name}`,
            files: [file],
          }

          if (navigator.canShare && navigator.canShare(data)) {
            navigator.share(data)
          }
        }
      }
    } catch (error) {}
  }

  const keepShopping = () => {
    navigate("/")
  }

  return (
    <S.Page>
      <Feedback data={feedback} />
      <Header />

      <Container>
        <S.Main>
          <S.Block $k={2}>
            <S.BlockTitle $k={4}>
              {payed
                ? "Veja os detalhes do seu pedido:"
                : "Agora só falta concluir o seu Pix."}
            </S.BlockTitle>

            {payed ? (
              <S.PayedArea>
                <S.Icons className="iconsArea">
                  <div onClick={handleDownload}>
                    <DownloadIcon />
                    <span>Baixar</span>
                  </div>
                  <div onClick={handleShare}>
                    <ShareIcon />
                    <span>Enviar</span>
                  </div>
                </S.Icons>
                <S.Button
                  $outlined={true}
                  $content={true}
                  onClick={keepShopping}
                >
                  Comprar mais
                </S.Button>
              </S.PayedArea>
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

          <S.Block $k={1}>
            <S.BlockTitle $k={3}>
              Pedido {payed ? "realizado" : "iniciado"}
            </S.BlockTitle>

            <S.EventInfo>
              {event?.event_banner && (
                <img src={event?.event_banner} alt={""} />
              )}

              <div className="eventInfos">
                <S.BlockTitle $k={4.5}>{event?.name}</S.BlockTitle>
                <BlockInfo
                  k={5}
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
                  k={6}
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
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default PaymentPix
