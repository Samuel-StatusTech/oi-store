import { TTicketStatus } from "../@types/ticket"

export const statusRelations: { [key in TTicketStatus]: string } = {
  purchased: "Disponível",
  validated: "Utilizado",
  expired: "Expirado",
}
