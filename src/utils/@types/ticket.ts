export type TTicketDisposal = {
  id: number | string
  name: string
  qnt: number
  price: number
  availability?: number | string
}

export type TTicket = {
  id: number | string
  title: string
  code: string
  status: TTicketStatus
}

export type TTicketStatus = "purchased" | "validated" | "expired"
