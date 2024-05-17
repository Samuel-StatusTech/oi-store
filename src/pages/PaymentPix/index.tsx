import * as S from "./styled"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import BlockInfo from "../../components/BlockInfo"

import qrExample from "../../assets/images/exemplo-qr.png"

import example from "../../assets/images/exemplo.png"
import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"
import { useEffect, useState } from "react"
import { temporizadorDeCincoMinutos } from "../../utils/tb/timer"

const Payment = () => {
  const [time, setTime] = useState("05:00")
  const [qrCode] = useState("código QR")

  const copyQRToClipboard = () => {
    navigator.clipboard.writeText(qrCode).then(
      function () {
        // ...
      },
      function () {
        // ...
      }
    )
  }

  useEffect(() => {
    const timer = temporizadorDeCincoMinutos()

    timer.iniciar()

    setInterval(() => {
      setTime(timer.tempoAtualFormatado())
    }, 1000)
  }, [])

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
                    "Centro de Evento - Rua Aubé, 895 - centro,",
                    "Joiville - SC, 89205-000",
                  ]}
                />
                <BlockInfo
                  small={true}
                  icon={<img src={location} alt={""} width={40} />}
                  description={[
                    "Centro de Evento - Rua Aubé, 895 - centro,",
                    "Joiville - SC, 89205-000",
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
                <img src={qrExample} alt={""} />
                <S.Button onClick={copyQRToClipboard}>Copiar código</S.Button>
              </S.QR>
              <S.PixTime>
                <span>Você tem</span>
                <span>{time}</span>
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
