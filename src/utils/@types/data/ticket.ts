import { TProduct } from "./product"

export type TTicketDisposal = TProduct & {
  qnt: number
}

export type TCardTicket = {
  order_id: string
  eventBanner: string
  created_at: string
  total_price: string
  status: any | null
  sold_quantity: number
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
  user?: {
    name: string
  }
  opuid: string
  id: string
  name: string
  batch_name: string
  qr_data: string
  qr_TID?: string
  order_id: string
  image: null | string
  quantity: number
  price_unit: number
  price_total: number
  date: string
}
