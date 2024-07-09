/* eslint-disable react-hooks/exhaustive-deps */
import * as S from "./styled"
import Container from "../Container"
import downloadTickets from "../../utils/pdf"
import getStore from "../../store"
import { TTicket } from "../../utils/@types/data/ticket"
import { useCallback, useEffect, useState } from "react"

type Props = {
  tickets: TTicket[]
  showing: boolean
  closeFn: () => void
}

const Popup = ({ tickets, showing, closeFn }: Props) => {
  const { event } = getStore()

  const [base64Image, setBase64Image] = useState<any>(null)

  const handleShare = async (e?: any) => {
    e?.preventDefault()

    if (navigator.canShare() && event) {
      try {
        const file = await downloadTickets(
          { ...event, logoFixed: base64Image ?? event?.logoFixed },
          tickets
        )

        if (file instanceof File) {
          navigator.share({
            title: `Meus Tickets para ${event.name}`,
            files: [file],
          })
        }
      } catch (error) {}
    }
  }

  const handleButton = async (role: "download" | "share" | "close") => {
    switch (role) {
      case "close":
        closeFn()
        break
      case "share":
        handleShare()
        break
      case "download":
        if (event)
          await downloadTickets(
            { ...event, logoFixed: base64Image ?? event?.logoFixed },
            tickets,
            true
          )
        break
      default:
        break
    }
  }

  const fetchImage = useCallback(async () => {
    try {
      if (event?.logoFixed) {
        const imageUrl = event?.logoFixed
        const response = await fetch(imageUrl)
        const blob = await response.blob()

        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result?.toString() || ""
          console.log("BASE64: ", base64data)
          setBase64Image(base64data)
        }

        reader.readAsDataURL(blob)
      }
    } catch (error) {}
  }, [])

  useEffect(() => {
    fetchImage()
  }, [fetchImage])

  return (
    <S.Area $showing={showing}>
      <Container>
        <S.Title>Sua compra</S.Title>
        <S.TicketsArea>
          {tickets.map((t) => (
            <S.TicketCard></S.TicketCard>
          ))}
        </S.TicketsArea>
        <S.Footer>
          <S.Button onClick={() => handleButton("download")} $color="blue">
            Baixar
          </S.Button>
          <S.Button onClick={() => handleButton("share")} $color="yellow">
            Compartilhar
          </S.Button>
          <S.Button onClick={() => handleButton("close")} $color="red">
            Fechar
          </S.Button>
        </S.Footer>
      </Container>
    </S.Area>
  )
}

export default Popup
