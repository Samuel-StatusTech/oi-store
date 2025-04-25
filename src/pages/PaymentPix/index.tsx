/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { TShoppingTicket } from "../../utils/@types/data/ticket"
import { clockdown } from "../../utils/tb/timer"
import { getDatePeriod, getHours } from "../../utils/tb/getDatePeriod"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import BlockInfo from "../../components/BlockInfo"
import Feedback from "../../components/Feedback"

import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg"
import { ReactComponent as CheckCircle } from "../../assets/icons/check_circle.svg"
import { ReactComponent as FileIcon } from "../../assets/icons/file_icon.svg"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import loadingAnimation from "../../assets/animations/loading"

import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"
import getStore from "../../store"
import { Api } from "../../api"
import { getOrderData } from "../../utils/tb/order"
import downloadTickets from "../../utils/pdf"
import { generateTicketID } from "../../utils/tb/qrcode"
import { TUser } from "../../utils/@types/data/user"
import { TEventData } from "../../utils/@types/data/event"

const io = require("socket.io-client")

const socketUrl = "https://api.oitickets.com.br"

const PaymentPix = () => {
  const lctn = useLocation()
  const navigate = useNavigate()

  const eventData = sessionStorage.getItem("event")

  const event = eventData ? JSON.parse(eventData) : null

  const { controllers } = getStore()

  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user") as string)
    : null

  const [time, setTime] = useState("05:00")
  const [sid, setSid] = useState("")
  const [oid, setOid] = useState<any>(null)

  const [buyedTickets, setBuyedTickets] = useState<TShoppingTicket[]>([])

  const [qrCode, setQrCode] = useState("")
  const [qrCode64, setQrCode64] = useState("")
  const [feedback, setFeedback] = useState<any>({ visible: false, message: "" })

  const [payed, setPayed] = useState(false)

  // ----- MERCADOPAGO -----

  const startSocket = async () => {
    if (!lctn.state.tickets || !lctn.state.buyer) return returnPage()
    else {
      const socket = instanceSocket()

      if (socket) {
        socket.on("plugged", (socketId: any) => {
          setSid(socketId)
        })

        socket.on("connect_error", () => {
          alert("Ops, houve um erro. Tente novamente mais tarde")
          socket.off("disconnect")
          socket.disconnect()
          navigate(-1)
          return
        })

        // monitor payment

        socket.on("orderUpdate", async (data: any) => {
          if (data.status === "approved" || data.status === "denied") {
            let f = {
              state: data.status,
              visible: false,
              message: data.message,
            }

            if (data.status === "approved") {
              const purchase = await confirmPurchase(data.sId, data.code)

              if (purchase.ok && !purchase.data.success) f.state = "denied"

              f.visible = true
            }

            setFeedback(f)

            setTimeout(() => {
              setFeedback({ ...f, visible: false })

              if (f.state === "approved") {
                setTimeout(() => {
                  setPayed(true)
                  localStorage.setItem("payed", "true")
                }, 400)
              }
            }, 3500)
          }

          // if (data.status === "expired") {
          //   socket.disconnect()
          //   instanceSocket()
          // }
        })
      }
    }
  }

  const getQR = async () => {
    try {
      const orderData = getOrderData({
        tickets: lctn.state.tickets,
        buyer: lctn.state.buyer,
        taxTotal: !Number.isNaN(lctn.state.taxTotal)
          ? Number(lctn.state.taxTotal)
          : 0,
        sid,
        user: user as TUser,
        dk: (event as TEventData).dk,
        eventId: (event as TEventData).id,
      })

      if (orderData) {
        const qr = await Api.get.qrcode({ order: orderData } as any)

        if (qr.ok) {
          setQrCode(qr.data.qrcodes.code)
          setQrCode64(qr.data.qrcodes.base64)
          runTimer()
        }
      }
    } catch (error) {}
  }

  const startPurchase = async () => {
    if (user && user.fone) {
      await signPurchase(sid)
      getQR()
    } else {
      navigate(-1)
      return
    }
  }

  useEffect(() => {
    if (sid) startPurchase()
  }, [sid])

  // ----- PAGE -----

  const copyQRToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(qrCode).then(() => {
          alert("Código copiado")
        })
      } else {
        const textarea = document.createElement("textarea")

        textarea.value = qrCode

        // Torna o elemento invisível
        textarea.style.position = "fixed"
        textarea.style.zIndex = "-1"
        textarea.style.visibility = "invisible"
        textarea.style.opacity = "0"

        document.body.appendChild(textarea)

        textarea.select()

        try {
          // Executa o comando de cópia
          const successful = document.execCommand("copy")
          const msg = successful
            ? "Texto copiado com sucesso!"
            : "Falha ao copiar o texto."
          alert(msg)
        } catch (err) {
          alert("Erro ao copiar o código. Tente novamente mais tarde")
        }

        textarea.remove()
      }
    } catch (error) {
      alert(error)
    }
  }

  const returnPage = () => {
    navigate(-1)
  }

  const instanceSocket = useCallback(() => {
    const socket = io(socketUrl, {
      autoConnect: true,
      closeOnBeforeunload: false,
      path: "",
      secure: false,
    })

    return socket
  }, [])

  const restartTimer = () => {
    setQrCode("")
    setQrCode64("")
    setTime("05:00")

    getQR()
  }

  const runTimer = () => {
    const timer: any = clockdown(
      300,
      restartTimer,
      (newTime?: string | null) => {
        if (newTime) setTime(newTime)
      }
    )

    timer.start()
  }

  const loadEventData = useCallback(async () => {
    if (event) {
      try {
        const req = await Api.get.eventInfo({ eventId: event?.id })

        if (req.ok) {
          const data = req.data
          sessionStorage.setItem("event", JSON.stringify(data))
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

  const signPurchase = useCallback(async (sId: string) => {
    if (sId && event && event?.id && user) {
      const orderData = getOrderData({
        tickets: lctn.state.tickets,
        buyer: lctn.state.buyer,
        taxTotal: !Number.isNaN(+lctn.state.taxTotal)
          ? Number(lctn.state.taxTotal)
          : 0,
        sid,
        user: user,
        dk: event.dk,
        eventId: event.id,
      })

      const sign = await Api.post.purchase.sign({
        user_fone: user?.fone,
        event_id: event?.id as string,
        order_id: sId,
        products: lctn.state.tickets as any,
        payments: [
          {
            payment_type: "pix",
            price: orderData?.transaction_amount as number,
            transitionCode: null,
            transitionId: null,
          },
        ],
      })

      if (sign.ok && sign.data.success) {
        setOid(sign.data.order_id)

        loadPurchaseData(sign.data.order_id)
      }
    }
  }, [])

  const loadPurchaseData = useCallback(async (orderId: string) => {
    // place data
    if (event) {
      try {
        const p = await Api.get.purchaseInfo({ eventId: event.id, orderId })

        if (p.ok && p.data.id) {
          let pdfTickets: any[] = []

          const tickets = p.data.products

          tickets.forEach((t, k) => {
            const tid = generateTicketID(
              false,
              "ecommerce",
              t.opuid,
              event?.oid as number,
              event?.dbName
            )

            pdfTickets.push({
              id: t.id,
              name: t.name,
              batch_name: t.batch_name,
              event_name: event?.name as string,
              qr_data: t.qr_data,
              qr_TID: tid,
              order_id: sid,
              date: new Date(t.date).toISOString(),
              image: null,
              quantity: t.quantity,
              price_unit: t.price_unit,
              ticket_name: (t as any).ticket_name,
            })
          })

          setBuyedTickets(pdfTickets)
        }
      } catch (error) {}
    }
  }, [])

  const confirmPurchase = useCallback(async (sId: string, pcode: string) => {
    return await Api.post.purchase.confirm({
      order_id: sId,
      order_number: oid,
      payment_code: pcode,
    })
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })

    if (!lctn.state.purchaseEmail || !lctn.state.tickets) {
      navigate("/", { replace: true, state: {} })
      return
    }

    try {
      loadEventData()
      startSocket()
    } catch (error) {}
  }, [loadEventData])

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

  const handleSee = async () => {
    try {
      if (event) {
        const file = await downloadTickets(event, buyedTickets)

        if (file instanceof File) {
          const url = URL.createObjectURL(file)
          window.open(url, "_blank")
        }
      }
    } catch (error) {}
  }

  const keepShopping = () => {
    navigate("/", { replace: true, state: {} })
  }

  return (
    <S.Page>
      <Feedback data={feedback} />
      <Header />

      <Container>
        <S.Main>
          <S.Block $k={2}>
            {payed && (
              <S.Feedback $k={3}>
                <span>Tudo certo! Pedido Aprovado</span>
                <CheckCircle />
              </S.Feedback>
            )}
            {payed && (
              <S.FeedbackIntructions $k={4}>
                <span>
                  Baixe seus ingressos em PDF ou Compartilhe para seu WhatsApp!
                </span>
              </S.FeedbackIntructions>
            )}

            {!payed && (
              <S.BlockTitle $k={4}>
                Agora só falta concluir o seu Pix.
              </S.BlockTitle>
            )}

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
                  <div onClick={handleSee}>
                    <FileIcon />
                    <span>Ver ingressos</span>
                  </div>
                </S.Icons>
                <S.Button
                  $outlined={true}
                  $content={true}
                  onClick={keepShopping}
                >
                  Comprar mais
                </S.Button>
                <S.FeedbackIntructions $k={4}>
                  <span>
                    Cópia enviada para {lctn.state.buyer.email ?? "seu email"}
                  </span>
                </S.FeedbackIntructions>
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
                      {qrCode && qrCode64 && (
                        <img
                          src={`data:image/jpeg;base64,${qrCode64}`}
                          alt=""
                        />
                      )}

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
                  <span>
                    Após o pagamento, clique em <strong>Meus ingressos</strong>{" "}
                    para ver seus ingressos
                  </span>
                </S.PixTime>
              </S.PixArea>
            )}
          </S.Block>

          {!payed && (
            <S.Block $k={1}>
              <S.BlockTitle $k={3}>Pedido iniciado</S.BlockTitle>

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
                      `${event?.local}. ${event?.address}`,
                      `${event?.city ?? ""}${
                        event?.uf ? ` - ${event?.uf}` : ""
                      }`,
                    ]}
                  />
                </div>
              </S.EventInfo>
            </S.Block>
          )}
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default PaymentPix
