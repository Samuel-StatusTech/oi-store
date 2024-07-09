import * as S from "./styled"
import Container from "../Container"
import downloadTickets from "../../utils/pdf"
import getStore from "../../store"
import { TTicket } from "../../utils/@types/data/ticket"

type Props = {
  tickets: TTicket[]
  showing: boolean
  closeFn: () => void
}

const Popup = ({ tickets, showing, closeFn }: Props) => {
  const { event } = getStore()

  const handleShare = async (e?: any) => {
    e?.preventDefault()

    if (navigator.canShare() && event) {
      try {
        const file = await downloadTickets(event, tickets)

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
        if (event) await downloadTickets(event, tickets, true)
        break
      default:
        break
    }
  }

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
