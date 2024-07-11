import { TProduct } from "./product"

export type TTicketDisposal = TProduct & {
  qnt: number
}

export type TCardTicket = {
  ticketId: string
  eventBanner: string
  name: string
  price_sell: string
  ticketsQnt: number
}

export type TTicket = {
  id: string
  name: string
  code: string
  bucket?: string
  group_name?: string
  price_sell?: string
  user?: {
    name: string
  }
  status: TTicketStatus
}

export type TTicketStatus = "purchased" | "validated" | "expired"

export interface TShoppingTicket {
  user?: any
  id: number | string
  name: string
  batch_name: string
  event_name: string
  qr_data: string
  order_id: string
  date: string
  image: null | string
  quantity: number
  price_unit: number
}
