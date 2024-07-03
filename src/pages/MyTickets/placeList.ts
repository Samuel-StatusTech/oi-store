import exemplo from "../../assets/images/exemplo.jpg"
import { TCardTicket } from "../../utils/@types/data/ticket"

export const placeList: TCardTicket[] = [
  {
    ticketId: "idDoEvento",
    eventBanner: exemplo,
    name: "Ingresso VIP",
    price_sell: "R$ 50,00",
    ticketsQnt: 12,
  },
  {
    ticketId: "idDoEvento",
    eventBanner: exemplo,
    name: "Ingresso Masculino",
    price_sell: "R$ 30,00",
    ticketsQnt: 12,
  },
  {
    ticketId: "idDoEvento",
    eventBanner: exemplo,
    name: "Ingresso Feminino",
    price_sell: "R$ 20,00",
    ticketsQnt: 12,
  },
  {
    ticketId: "idDoEvento",
    eventBanner: exemplo,
    name: "Meia entrada",
    price_sell: "R$ 15,00",
    ticketsQnt: 12,
  },
]
