/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { TShoppingTicket } from "../../utils/@types/data/ticket"
import { clockdown } from "../../utils/tb/timer"
import * as S from "./styled"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import Feedback from "../../components/Feedback"

import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg"
// import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg"
import { ReactComponent as CheckCircle } from "../../assets/icons/check_circle.svg"
import { ReactComponent as FileIcon } from "../../assets/icons/file_icon.svg"
import { ReactComponent as WhatsappIcon } from "../../assets/icons/whatsapp.svg"

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
import AskPhoneNumberModal from "../../components/Modal/AskPhoneNumber"
import { formatDate } from "date-fns"

const io = require("socket.io-client")

const socketUrl =
  process.env.REACT_APP_SOCKET_URL || "https://api.oitickets.com.br"

const PaymentPix = () => {
  const lctn = useLocation()
  const navigate = useNavigate()

  const eventData = localStorage.getItem("event")

  const event = eventData ? (JSON.parse(eventData) as TEventData) : null

  const { controllers } = getStore()

  const user = localStorage.getItem("user")
    ? (JSON.parse(localStorage.getItem("user") as string) as TUser)
    : null

  const [time, setTime] = useState("15:00")
  const [sid, setSid] = useState("")
  const [orderId, setOrderId] = useState<any>(null)
  const [externalReference, setExternalReference] = useState<any>(null)

  const [buyedTickets, setBuyedTickets] = useState<TShoppingTicket[]>([])

  const [isAskingWhatsappPhone, setIsAskingWhatsappPhone] = useState(false)
  const [requiringQr, setRequiringQr] = useState(false)

  const [totalOrderAmount, setTotalOrderAmount] = useState(0)
  const [qrCode, setQrCode] = useState("")
  const [qrCode64, setQrCode64] = useState("")
  const [feedback, setFeedback] = useState<any>({ visible: false, message: "" })

  const alreadyRequestingPaymentRef = useRef(false)

  const payedRef = useRef(false)
  const paymentSessionRef = useRef<TPaymentSession | null>(null)

  const isOrderConfirmingRef = useRef(false)
  const isOrderConfirmedRef = useRef(false)

  const [payed, setPayed] = useState(false)
  const [expired, setExpired] = useState(false)

  // ----- EMAIL -----

  const handleEmail = async (purchaseInfo: {
    status: string
    amount: number
    message: string
    sId: string
    transition_id: string
    time: string
  }) => {
    try {
      const req = await Api.get.purchaseInfo({
        eventId: event?.id as string,
        orderId: purchaseInfo.sId,
      })

      if (req.ok) {
        const external_reference = req.data.extref

        const parsedData = parsePurchaseInfo(req.data)

        setBuyedTickets(parsedData)

        const purchaseValue = pageTools.order.getOrderValue(
          lctn.state.tickets,
          lctn.state.buyer,
          lctn.state.taxTotal,
          sid,
          user as TUser,
          event?.dk as string,
          event?.id as string,
          event?.name as string
        )

        const targetEmail = (lctn.state.buyer?.email as string) ?? "seu email"
        const buyerName = lctn.state.buyer?.name as string

        pageTools.email.sendEmail(
          event as TEventData,
          user as TUser,
          purchaseValue,
          lctn.state.tickets,
          {
            ...purchaseInfo,
            taxTotal: lctn.state.taxTotal as number,
            transition_id: external_reference,
            time: new Date(req.data.products[0].date).toISOString(),
          },
          parsedData,
          targetEmail,
          buyerName
        )
      }
    } catch (error) {}
  }

  // ----- MERCADOPAGO -----

  const checkPendingPayment = useCallback(() => {
    const paymentSession = localStorage.getItem("paymentSession")
    const paymentToRecover: TPaymentSession | null = paymentSession
      ? JSON.parse(paymentSession)
      : null

    if (paymentToRecover) {
      const runnedTime = Math.floor(
        (new Date().getTime() - +paymentToRecover.paymentStartedAt) / 1000
      )

      const remainingTime = 15 * 60 - runnedTime

      const isPaymentRecoverable = remainingTime > 0 // checkPaymentValidity

      if (isPaymentRecoverable) {
        setQrCode(paymentToRecover.qrCode)
        setQrCode64(paymentToRecover.qrCode64)
        setTotalOrderAmount(paymentToRecover.amount)
        runTimer(remainingTime)

        startPoolingOrderStatus()
      } else handleExpiredPayment()
    }
  }, [localStorage, setQrCode, setQrCode64])

  const handlePlugged = useCallback((socketId: string) => {
    setSid(socketId)
  }, [])

  const handleExpiredPayment = () => {
    setExpired(true)
    localStorage.setItem("expired", "true")
    localStorage.removeItem("paymentSession")

    let f = {
      state: "expired",
      visible: true,
      message: "O tempo para pagamento expirou.",
    }

    setFeedback(f)

    setTimeout(() => {
      setFeedback({ ...f, visible: false })
    }, 3500)
  }

  const checkPaymentValidity = (paymentToRecover: TPaymentSession) => {
    let isValid = true

    const runnedTime = Math.floor(
      (new Date().getTime() - +paymentToRecover.paymentStartedAt) / 1000
    )

    const remainingTime = 15 * 60 - runnedTime

    isValid = remainingTime > 0

    return isValid
  }

  const startPoolingOrderStatus = useCallback(async (retries = 0) => {
    try {
      const paymentSession = localStorage.getItem("paymentSession")
      const paymentToRecover: TPaymentSession | null = paymentSession
        ? JSON.parse(paymentSession)
        : null

      if (paymentToRecover) {
        const isValid = checkPaymentValidity(paymentToRecover)

        if (!isValid) {
          handleExpiredPayment()
          return
        }

        const req = await Api.get.purchaseInfo({
          eventId: event?.id as string,
          orderId: paymentToRecover.socketId,
        })

        if (req.ok) {
          const { payments } = req.data

          const status =
            payments.length === 0 ? false : payments[0].transition_code !== null

          if (status) {
            const purchase = await confirmPurchase(
              paymentToRecover.socketId,
              paymentToRecover.paymentId
            )

            let f = {
              state: "validado",
              visible: false,
              message: "Pagamento realizado com sucesso.",
            }

            if (purchase.ok) {
              f.visible = true

              setFeedback(f)

              setPayed(true)
              payedRef.current = true
              localStorage.removeItem("paymentSession")
              paymentSessionRef.current = null

              localStorage.setItem("payed", "true")

              handleEmail({
                amount: paymentToRecover.amount,
                message: "",
                sId: paymentToRecover.socketId,
                status: "validado",
                time: new Date().toISOString(),
                transition_id: paymentToRecover.extref,
              })

              setTimeout(() => {
                setFeedback({ ...f, visible: false })
              }, 3500)
            }
          } else {
            const isPayed = localStorage.getItem("payed") === "true"
            const isPaymentPage = window.location.href.endsWith("pix")

            if (isPaymentPage && !isPayed) {
              setTimeout(() => {
                startPoolingOrderStatus(retries)
              }, 4000)

              return
            }
          }
        }
      } else {
        if (retries <= 3) {
          setTimeout(() => {
            startPoolingOrderStatus(retries + 1)
          }, 3000)
        }
      }
    } catch (error) {}
  }, [])

  const startSocket = async () => {
    if (!payed && !localStorage.getItem("paymentSession")) {
      const socket = instanceSocket()

      if (socket) {
        socket.on("plugged", (socketData: any) => {
          handlePlugged(socketData)
          socket.disconnect()
        })
      }
    }
  }

  const storeDataIntoPaymentSession = (
    qrCode: string,
    qrCode64: string,
    paymentAmount: number
  ) => {
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
          amount: paymentAmount,
        }

        paymentSessionRef.current = newData
        localStorage.setItem("paymentSession", JSON.stringify(newData))
      }
    }
  }

  const getQR = async (socketId?: string, extref?: string) => {
    try {
      if (!requiringQr && (socketId || sid) && (extref || externalReference)) {
        setRequiringQr(true)

        const external_reference = extref ?? externalReference

        const orderData = getOrderData({
          tickets: lctn.state.tickets,
          buyer: lctn.state.buyer,
          taxTotal: !Number.isNaN(lctn.state.taxTotal)
            ? Number(lctn.state.taxTotal)
            : 0,
          sid: socketId ?? sid,
          external_reference: external_reference,
          user: user as TUser,
          dk: (event as TEventData).dk,
          eventId: (event as TEventData).id,
          eventName: (event as TEventData).name,
        })

        if (orderData) {
          const qr = await Api.get.qrcode({ order: orderData } as any)

          if (qr.ok) {
            setQrCode(qr.data.qrcodes.code)
            setQrCode64(qr.data.qrcodes.base64)
            storeDataIntoPaymentSession(
              qr.data.qrcodes.code,
              qr.data.qrcodes.base64,
              orderData.transaction_amount
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
      const extref = await signPurchase(sid)
      await getQR(sid, extref)
      startPoolingOrderStatus()
    } else {
      returnPage()
      return
    }
  }

  const checkIsRefreshAfterPayment = async () => {
    let savedPayment = false

    await new Promise((resolve) =>
      setTimeout(() => {
        const localPayed = localStorage.getItem("payed")
        savedPayment = localPayed
          ? localStorage.getItem("payed") === "true"
          : false
        resolve(true)
      }, 500)
    )

    return savedPayment
  }

  const ignite = useCallback(async () => {
    const pendingPayment: TPaymentSession | null =
      paymentSessionRef.current ?? localStorage.getItem("paymentSession")
        ? JSON.parse(localStorage.getItem("paymentSession") ?? "{}")
        : null

    const savedPayment = localStorage.getItem("payed")

    const wasExpired = localStorage.getItem("expired") === "true"

    const isPayed =
      payedRef.current ?? savedPayment ? savedPayment === "true" : payed

    const hasOngoingPurchase = !!pendingPayment

    if (wasExpired) {
      handleExpiredPayment()
    } else if (!isPayed) {
      if (hasOngoingPurchase) {
        checkPendingPayment()
      } else {
        const alreadyPayed = await checkIsRefreshAfterPayment()

        if (alreadyPayed) {
          goToMyTickets()
          return
        } else {
          if (
            sid !== "" &&
            expired === false &&
            !alreadyRequestingPaymentRef.current
          ) {
            alreadyRequestingPaymentRef.current = true

            await startPurchase()
          }
        }
      }
    }
  }, [
    sid,
    paymentSessionRef.current,
    payedRef.current,
    alreadyRequestingPaymentRef.current,
    payed,
    expired,
  ])

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
    const savedPayed = localStorage.getItem("payed") === "true" || payed

    if (!savedPayed) {
      setQrCode("")
      setQrCode64("")
      setTime("15:00")

      // getQR()
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
          localStorage.setItem("event", JSON.stringify(data))
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

  const signPurchase = useCallback(
    async (sId: string): Promise<string | undefined> => {
      let extref

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
          eventName: event.name,
        })

        const sign = await Api.post.purchase.sign({
          user_fone: user?.fone,
          event_id: event?.id as string,
          order_id: sId,
          buyer_name: lctn.state.buyer ? lctn.state.buyer.name : "",
          buyer_email: lctn.state.buyer ? lctn.state.buyer.email : "",
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
          extref = sign.data.extref
          const order_id = sign.data.order_id
          setOrderId(order_id)
          setExternalReference(extref)

          const localPaymentSession = localStorage.getItem("paymentSession")

          if (!localPaymentSession) {
            const paymentSession: TPaymentSession = {
              extref: extref,
              paymentId: sign.data.order_id,
              socketId: sId,
              qrCode: "",
              qrCode64: "",
              paymentStartedAt: new Date().getTime().toString(),
              amount: orderData?.transaction_amount as number,
            }

            localStorage.setItem(
              "paymentSession",
              JSON.stringify(paymentSession)
            )
          }

          loadPurchaseData(sign.data.order_id)
        }
      }

      return extref
    },
    []
  )

  const parsePurchaseInfo = (p: any) => {
    let data: any = []

    let pdfTickets: any[] = []

    const tickets = p.products as any[]

    const external_reference = p.extref
    const buyer_name = p.buyer_name

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
        user_name: (t as any).user_name,
        buyer_name: buyer_name,
        TRN: external_reference,
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

  const confirmPurchase = async (sId: string, pcode: string) => {
    if (!isOrderConfirmingRef.current && !isOrderConfirmedRef.current) {
      isOrderConfirmingRef.current = true

      const confirmation = await Api.post.purchase.confirm({
        order_id: sId,
        order_number: orderId,
        payment_code: pcode,
      })

      if (confirmation.ok && confirmation.data.success) {
        isOrderConfirmedRef.current = true
      }

      isOrderConfirmingRef.current = false

      return confirmation
    } else {
      return { ok: false, data: { success: false } }
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0 })

    try {
      if (!lctn.state?.tickets) keepShopping()
      else {
        loadEventData()
        startSocket()
      }
    } catch (error) {}
  }, [])

  const handleDownload = async () => {
    if (event) await downloadTickets(event, buyedTickets, true)
  }

  /*
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
  */

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

  const sendWhatsapp = async (targetPhone: string) => {
    try {
      if (event) {
        const file = await downloadTickets(event, buyedTickets, false, true)

        const hasMultipleTickets =
          buyedTickets.reduce((sum, current) => sum + current.quantity, 0) > 1

        await Api.post.whatsapp.sendWhatsapp({
          base64File: file as string,
          fileName: `Meus Ingressos para ${event.name.trim()}.pdf`,
          targetPhone: targetPhone,
          caption: `Olá, segue seu${hasMultipleTickets ? "(s)" : ""} ingresso${
            hasMultipleTickets ? "(s)" : ""
          } para o ${event.name} - ${formatDate(event.date_ini, "dd/MM/yyyy")}`,
        })
      }
    } catch (error) {}
  }

  const handleWhatsapp = async () => {
    setIsAskingWhatsappPhone(true)
  }

  const keepShopping = () => {
    navigate("/", { replace: true, state: { backRoute: "/eventSelect" } })
  }

  const goToMyTickets = () => {
    navigate("/mytickets", { replace: true, state: { backRoute: "/" } })
  }

  // ----- CALCULATE ORDER TOTAL AMOUNT -----

  useEffect(() => {
    if (!lctn.state?.tickets) {
      keepShopping()
      return
    }

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
          event?.id as string,
          event?.name as string
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

      <AskPhoneNumberModal
        handleClose={() => {
          setIsAskingWhatsappPhone(false)
        }}
        handleConfirm={async (phone) => {
          await sendWhatsapp(phone)
          setIsAskingWhatsappPhone(false)
        }}
        basePhone={lctn.state.buyer.phone}
        shown={isAskingWhatsappPhone}
      />

      <Container fullHeight={true}>
        <S.Main>
          <S.Block $k={2}>
            {/* Expired */}
            {expired && (
              <S.Feedback $k={3}>
                <span>Tempo esgotado!</span>
                <CheckCircle />
              </S.Feedback>
            )}

            {expired && (
              <S.FeedbackIntructions $k={4}>
                <span>
                  O tempo para pagamento expirou. Por favor, inicie uma nova
                  compra.
                </span>
              </S.FeedbackIntructions>
            )}

            {expired && (
              <S.PayedArea>
                <S.Button
                  $outlined={true}
                  $content={true}
                  onClick={keepShopping}
                >
                  Iniciar nova compra
                </S.Button>
              </S.PayedArea>
            )}

            {/* Payed */}
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

            {!payed && !expired && (
              <S.BlockTitle $k={4}>
                Agora só falta concluir o seu Pix.
              </S.BlockTitle>
            )}

            {payed && (
              <S.PayedArea>
                <S.Icons className="iconsArea">
                  <div onClick={handleDownload}>
                    <DownloadIcon />
                    <span>Baixar</span>
                  </div>
                  {/* <div onClick={handleShare} className="shareBtn">
                    <ShareIcon />
                    <span>Enviar</span>
                  </div> */}
                  <div onClick={handleSee} className="seeTickets">
                    <FileIcon />
                    <span>Ver ingressos</span>
                  </div>
                  <div onClick={handleWhatsapp} className="whatsappSharing">
                    <WhatsappIcon />
                    <span>Whatsapp</span>
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
            )}

            {!expired && !payed && (
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

          {!payed && (
            <OrderResume
              hideEventData={true}
              onlyPurchasingItems={true}
              fitContainer={true}
              ticketsList={
                lctn.state.disposalTickets.length > 0
                  ? lctn.state.disposalTickets
                  : lctn.state.tickets
              }
            />
          )}
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default PaymentPix
