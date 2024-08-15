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
    purchase: {
      sign: Promise<
        TDefaultRes<
          | {
              success: true
              order_id: string
              order_number: number
            }
          | {
              success: false
            }
        >
      >
      mpGenerate: Promise<
        TDefaultRes<
          | {
              success: true
              data: any
            }
          | {
              success: false
            }
        >
      >
      confirm: Promise<
        TDefaultRes<{
          success: boolean
        }>
      >
    }
  }
}

export default TResponses
