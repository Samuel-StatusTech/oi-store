/* eslint-disable react-hooks/exhaustive-deps */
import * as S from "./styled"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import BlockInfo from "../../components/BlockInfo"

import example from "../../assets/images/exemplo.png"
import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"
import { useCallback, useEffect, useState } from "react"
import { temporizadorDeCincoMinutos } from "../../utils/tb/timer"
import getStore from "../../store"
import { Api } from "../../api"
import { getDatePeriod } from "../../utils/tb/getDatePeriod"
import QRCode from "qrcode.react"
import { useLocation, useNavigate } from "react-router-dom"
import { TTicket } from "../../utils/@types/data/ticket"

const Payment = () => {
  const lctn = useLocation()
  const navigate = useNavigate()

  const { event } = getStore()

  const [time, setTime] = useState("05:00")
  const [qrCode, setQrCode] = useState("")

  const copyQRToClipboard = () => {
    navigator.clipboard.writeText(qrCode).then(() => {
      alert("Código copiado")
    })
  }

  const getOrderData = useCallback(() => {
    const tickets = (lctn.state.tickets as TTicket[]) ?? null
    const buyer = lctn.state.buyer ?? null

    if (tickets) {
      const paymentValue = tickets.reduce(
        (sum, ticket) => sum + +(ticket.price_sell ?? "0"),
        0
      )

      const obj = {
        customer: {
          name: buyer.name ?? "Lorem ipsum",
          email: "null@null.null",
          tax_id: "12345678909",
        },
        items: tickets.map((t) => ({
          name: t.name,
          quantity: 1,
          unit_amount: +(t.price_sell ?? "0"),
        })),
        qr_codes: [{ amount: { value: paymentValue } }],
      }

      return obj
    } else return null
  }, [lctn.state.buyer, lctn.state.tickets])

  const returnPage = () => {
    navigate(-1)
  }

  const getPBcode = useCallback(async () => {
    if (!lctn.state.tickets) return returnPage()
    else {
      const orderData = getOrderData()
      if (orderData) {
        console.log("orderData", orderData)
        const req = await Api.get.qrcode({ order: orderData })

        if (req.ok) {
          setQrCode(req.data.qr_codes[0].text)

          runTimer()
        } else {
          // alert(req.error)
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

  useEffect(() => {
    getPBcode()
  }, [getPBcode])

  return (
    <S.Page>
      <Header />

      <Container>
        <S.Main>
          <S.Block>
            <S.BlockTitle>Pedido iniciado</S.BlockTitle>

            <S.EventInfo>
              <img src={example} alt={""} />

              <div className="eventInfos">
                <S.BlockTitle>Me encontra no Pagode!</S.BlockTitle>
                <BlockInfo
                  small={true}
                  icon={<img src={calendar} alt={""} width={40} />}
                  description={[
                    getDatePeriod(
                      event?.date_ini as string,
                      event?.date_end as string
                    ),
                    event?.time_ini ? event.time_ini.slice(0, 5) : "Dia todo",
                  ]}
                />
                <BlockInfo
                  small={true}
                  icon={<img src={location} alt={""} width={40} />}
                  description={[
                    "Rua Aubé, nº 895",
                    `${event?.city} - ${event?.uf}`,
                    "89205-00",
                  ]}
                />
              </div>
            </S.EventInfo>
          </S.Block>

          <S.Block>
            <S.BlockTitle>Agora só falta concluir o seu Pix.</S.BlockTitle>

            <S.PixArea>
              <S.PixInstructions>
                <span>
                  Utilize o <strong>código</strong> a seguir para realizar o
                  pagamento pelo <strong>aplicativo do seu banco</strong>
                </span>
              </S.PixInstructions>
              <S.QR>
                {qrCode && <QRCode value={qrCode} renderAs="svg" />}

                <S.Button onClick={copyQRToClipboard}>Copiar código</S.Button>
              </S.QR>
              <S.PixTime>
                <span>Você tem</span>
                <span>{time} </span>
                <span>para realizar o pagamento</span>
              </S.PixTime>
            </S.PixArea>
          </S.Block>
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default Payment
