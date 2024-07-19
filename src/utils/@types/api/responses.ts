import { TEventData, TEventMin } from "../data/event"
import { TProduct } from "../data/product"
import { TQrPaymentData } from "../data/qrCode"
import { TUser } from "../data/user"

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
    products: Promise<TDefaultRes<{ list: TProduct[] }>>
    myTickets: Promise<TDefaultRes<{ list: any[] }>>
  }
  post: {
    login: {
      requestCode: Promise<TDefaultRes<{}>>
      validateCode: Promise<TDefaultRes<TUser>>
    }
    order: {
      confirm: Promise<TDefaultRes<{}>>
    }
  }
}

export default TResponses
