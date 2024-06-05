import { TTicketStatus } from "../@types/data/ticket"

export const statusRelations: { [key in TTicketStatus]: string } = {
  purchased: "Disponível",
  validated: "Utilizado",
  expired: "Expirado",
}
