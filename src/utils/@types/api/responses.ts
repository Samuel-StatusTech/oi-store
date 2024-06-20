import { TEventData, TEventMin } from "../data/event"
import { TProduct } from "../data/product"
import { TQrPaymentData } from "../data/qrCode"

type TDefaultRes<T> =
  | {
      ok: false
      error: string
    }
  | {
      ok: true
      data: T
    }

type TResponses = {
  get: {
    qrcode: Promise<TDefaultRes<TQrPaymentData>>
    events: Promise<TDefaultRes<TEventMin[]>>
    eventInfo: Promise<TDefaultRes<TEventData>>
    products: Promise<
      TDefaultRes<{
        list: TProduct[]
      }>
    >
  }
  create: {
    product: Promise<
      TDefaultRes<{
        createdProduct: TProduct
      }>
    >
  }
}

export default TResponses
