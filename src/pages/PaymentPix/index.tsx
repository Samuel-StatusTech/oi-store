/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { TShoppingTicket } from "../../utils/@types/data/ticket"
import { clockdown } from "../../utils/tb/timer"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import Feedback from "../../components/Feedback"

import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg"
import { ReactComponent as CheckCircle } from "../../assets/icons/check_circle.svg"
import { ReactComponent as FileIcon } from "../../assets/icons/file_icon.svg"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import loadingAnimation from "../../assets/animations/loading"

import getStore from "../../store"
import { Api } from "../../api"
import { getOrderData } from "../../utils/tb/order"
import downloadTickets from "../../utils/pdf"
import { generateTicketID } from "../../utils/tb/qrcode"
import { TUser } from "../../utils/@types/data/user"
import { TEventData } from "../../utils/@types/data/event"
import { formatMoney } from "../../utils/tb/formatMoney"

import pageTools from "../../utils/tb/pageTools/pix"
import { TPaymentSession } from "../../utils/@types/data/paymentSession"
import OrderResume from "../../components/OrderResume"

const io = require("socket.io-client")

const socketUrl =
  process.env.REACT_APP_SOCKET_URL || "https://api.oitickets.com.br"

const PaymentPix = () => {
  const lctn = useLocation()
  const navigate = useNavigate()

  const eventData = sessionStorage.getItem("event")

  const event = eventData ? (JSON.parse(eventData) as TEventData) : null

  const { controllers } = getStore()

  const user = sessionStorage.getItem("user")
    ? (JSON.parse(sessionStorage.getItem("user") as string) as TUser)
    : null

  const [time, setTime] = useState("15:00")
  const [sid, setSid] = useState("")
  const [oid, setOid] = useState<any>(null)

  const [buyedTickets, setBuyedTickets] = useState<TShoppingTicket[]>([])

  const [requiringQr, setRequiringQr] = useState(false)

  const [totalOrderAmount, setTotalOrderAmount] = useState(0)
  const [qrCode, setQrCode] = useState("")
  const [qrCode64, setQrCode64] = useState("")
  const [feedback, setFeedback] = useState<any>({ visible: false, message: "" })

  const [payed, setPayed] = useState(false)

  // ----- EMAIL -----

  const handleEmail = async (purchaseInfo: {
    status: string
    amount: number
    message: string
    sId: string
    transaction_id: string
    time: string
  }) => {
    try {
      const req = await Api.get.purchaseInfo({
        eventId: event?.id as string,
        orderId: purchaseInfo.sId,
      })

      if (req.ok) {
        const parsedData = parsePurchaseInfo(req.data)

        setBuyedTickets(parsedData)

        const purchaseValue = pageTools.order.getOrderValue(
          lctn.state.tickets,
          lctn.state.buyer,
          lctn.state.taxTotal,
          sid,
          user as TUser,
          event?.dk as string,
          event?.id as string
        )

        pageTools.email.sendEmail(
          event as TEventData,
          user as TUser,
          purchaseValue,
          lctn.state.tickets,
          {
            ...purchaseInfo,
            time: new Date(req.data.products[0].date).toISOString(),
          },
          parsedData
        )
      }
    } catch (error) {}
  }

  // ----- MERCADOPAGO -----

  const clearAndGetNewPurchase = () => {
    localStorage.removeItem("paymentSession")
    const savedPayed = localStorage.getItem("payed") === "true"
    if (!savedPayed) {
      startPurchase()
    }
  }

  const checkPendingPayment = useCallback(
    (socket: any) => {
      const paymentSession = localStorage.getItem("paymentSession")
      const paymentToRecover: TPaymentSession | null = paymentSession
        ? JSON.parse(paymentSession)
        : null

      if (paymentToRecover) {
        const runnedTime = Math.floor(
          (new Date().getTime() - +paymentToRecover.paymentStartedAt) / 1000
        )

        const remainingTime = 15 * 60 - runnedTime

        const isPaymentRecoverable = remainingTime > 0

        if (isPaymentRecoverable && paymentToRecover.qrCode) {
          setQrCode(paymentToRecover.qrCode)
          setQrCode64(paymentToRecover.qrCode64)
          socket.emit("rejoinPaymentSession", {
            paymentId: paymentToRecover.paymentId,
            oldSocketId: paymentToRecover.socketId,
          })
          runTimer(remainingTime)
        } else clearAndGetNewPurchase()
      } else clearAndGetNewPurchase()
    },
    [localStorage, setQrCode, setQrCode64]
  )

  const handlePlugged = useCallback((socketId: string) => {
    setSid(socketId)
  }, [])

  const handleConnectError = useCallback((socket: any) => {
    alert("Ops, houve um erro. Tente novamente mais tarde")
    socket.off("disconnect")
    socket.disconnect()
    returnPage()
    return
  }, [])

  const handleOrderUpdate = useCallback(
    async (socket: any, data: any) => {
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
              localStorage.removeItem("paymentSession")

              localStorage.setItem("payed", "true")

              handleEmail(data)

              socket.disconnect()
              socket.off("plugged", handlePlugged)
              socket.off("connect_error", handleConnectError)
              socket.off("orderUpdate", handleOrderUpdate)
            }, 400)
          }
        }, 3500)
      }
    },
    [localStorage]
  )

  const startSocket = async () => {
    if (!payed) {
      const socket = instanceSocket()

      if (socket) {
        socket.on("connect", () => {
          checkPendingPayment(socket)
        })
        socket.on("plugged", handlePlugged)
        socket.on("connect_error", () => handleConnectError(socket))

        // monitor payment
        socket.on("orderUpdate", (socketData: any) => {
          handleOrderUpdate(socket, socketData)
        })

        // Disconnect after 15 minutes
        setTimeout(() => {
          socket.disconnect()
        }, 900000)
      }
    }
  }

  const storeQrCodeIntoPaymentSession = (qrCode: string, qrCode64: string) => {
    const paymentSession = localStorage.getItem("paymentSession")
    const paymentToRecover: TPaymentSession | null = paymentSession
      ? JSON.parse(paymentSession)
      : null

    if (paymentToRecover) {
      if (paymentToRecover.qrCode.length === 0) {
        const newData: TPaymentSession = {
          ...paymentToRecover,
          qrCode,
          qrCode64,
        }

        localStorage.setItem("paymentSession", JSON.stringify(newData))
      }
    }
  }

  const getQR = async (socketId?: string) => {
    try {
      if (!requiringQr && (socketId || sid)) {
        setRequiringQr(true)

        const orderData = getOrderData({
          tickets: lctn.state.tickets,
          buyer: lctn.state.buyer,
          taxTotal: !Number.isNaN(lctn.state.taxTotal)
            ? Number(lctn.state.taxTotal)
            : 0,
          sid: socketId ?? sid,
          user: user as TUser,
          dk: (event as TEventData).dk,
          eventId: (event as TEventData).id,
        })

        if (orderData) {
          const qr = await Api.get.qrcode({ order: orderData } as any)

          if (qr.ok) {
            setQrCode(qr.data.qrcodes.code)
            setQrCode64(qr.data.qrcodes.base64)
            storeQrCodeIntoPaymentSession(
              qr.data.qrcodes.code,
              qr.data.qrcodes.base64
            )
            runTimer()
          }
        }
      }
    } catch (error) {}

    setRequiringQr(false)
  }

  const startPurchase = async () => {
    if (user && user.fone) {
      await signPurchase(sid)
      getQR(sid)
    } else {
      returnPage()
      return
    }
  }

  const ignite = useCallback(async () => {
    const pendingPayment = localStorage.getItem("paymentSession")
    const isNewOrder = lctn.state?.isNewOrder ?? false

    if (!pendingPayment && sid !== "" && isNewOrder && !pendingPayment) {
      startPurchase()
    }
  }, [sid, localStorage, lctn])

  useEffect(() => {
    ignite()
  }, [ignite])

  // ----- PAGE -----

  const copyQRToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(qrCode).then(() => {
          let f = {
            state: "info",
            visible: true,
            message: "Código copiado",
          }

          setFeedback(f)

          setTimeout(() => {
            setFeedback({ ...f, visible: false })
          }, 2000)
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
    if (!payed) {
      setQrCode("")
      setQrCode64("")
      setTime("15:00")

      getQR()
    }
  }

  const runTimer = (seconds = 900) => {
    const timer: any = clockdown(
      seconds,
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
        sid: sId,
        user: user,
        dk: event.dk,
        eventId: event.id,
      })

      const sign = await Api.post.purchase.sign({
        user_fone: user?.fone,
        event_id: event?.id as string,
        order_id: sId,
        buyer_name: lctn.state.buyer ? lctn.state.buyer.name : "",
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

        const localPaymentSession = localStorage.getItem("paymentSession")

        if (!localPaymentSession) {
          const paymentSession: TPaymentSession = {
            paymentId: sign.data.order_id,
            socketId: sId,
            qrCode: "",
            qrCode64: "",
            paymentStartedAt: new Date().getTime().toString(),
          }

          localStorage.setItem("paymentSession", JSON.stringify(paymentSession))
        }

        loadPurchaseData(sign.data.order_id)
      }
    }
  }, [])

  const parsePurchaseInfo = (p: any) => {
    let data: any = []

    let pdfTickets: any[] = []

    const tickets = p.products as any[]

    tickets.forEach((t, k) => {
      const tid = generateTicketID(
        false,
        "ecommerce",
        t.opuid,
        event?.oid as number,
        event?.dbName as string
      )

      const dt = {
        id: t.id,
        name: t.name,
        batch_name: t.batch_name,
        event_name: event?.name as string,
        qr_data: t.qr_data,
        qr_label: t.qr_label,
        qr_TID: tid,
        order_id: sid,
        date: new Date(t.date).toISOString(),
        image: null,
        quantity: t.quantity,
        price_unit: t.price_unit,
        tax_value: t.tax_value,
        ticket_name: (t as any).ticket_name,
        TRN: t.transition_id,
      }

      pdfTickets.push(dt)
    })

    data = pdfTickets

    return data
  }

  const loadPurchaseData = async (orderId: string) => {
    // place data
    if (event) {
      try {
        const p = await Api.get.purchaseInfo({ eventId: event.id, orderId })

        if (p.ok && p.data.id) {
          const parsedData = parsePurchaseInfo(p.data)

          setBuyedTickets(parsedData)
        }
      } catch (error) {}
    }
  }

  const confirmPurchase = useCallback(async (sId: string, pcode: string) => {
    return await Api.post.purchase.confirm({
      order_id: sId,
      order_number: oid,
      payment_code: pcode,
    })
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })

    try {
      loadEventData()
      startSocket()
    } catch (error) {}
  }, [])

  const handleDownload = async () => {
    if (event) await downloadTickets(event, buyedTickets, true)
  }

  const handleShare = async () => {
    try {
      if (event) {
        const file = await downloadTickets(event, buyedTickets)

        if (file instanceof File) {
          const data = {
            title: `Meus Ingressos para ${event.name}`,
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

  useEffect(() => {
    if (totalOrderAmount === 0) {
      if (
        lctn.state.tickets !== undefined &&
        lctn.state.buyer !== undefined &&
        lctn.state.taxTotal !== undefined &&
        sid !== "" &&
        user &&
        event &&
        event.dk &&
        event.id
      ) {
        const orderValueAmount = pageTools.order.getOrderValue(
          lctn.state.tickets,
          lctn.state.buyer,
          lctn.state.taxTotal,
          sid,
          user as TUser,
          event?.dk as string,
          event?.id as string
        )

        if (!Number.isNaN(orderValueAmount))
          setTotalOrderAmount(orderValueAmount)
      }
    }
  }, [lctn.state, sid, user, event, totalOrderAmount])

  return (
    <S.Page>
      <Feedback data={feedback} />
      <Header />

      <Container fullHeight={true}>
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

                      <span>{formatMoney(totalOrderAmount, true)}</span>

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

          <OrderResume
            hideEventData={true}
            onlyPurchasingItems={true}
            fitContainer={true}
            ticketsList={
              lctn.state ? lctn.state.disposalTickets ?? lctn.state.tickets : []
            }
          />
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default PaymentPix
