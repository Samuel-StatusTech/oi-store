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
    myTickets: Promise<TDefaultRes<{ list: any[] }>>
    products: Promise<TDefaultRes<{ list: TProduct[] }>>
    purchaseInfo: Promise<
      TDefaultRes<{
        id: string
        products: {
          opuid: string
          id: string
          name: string
          batch_name: string
          qr_data: string
          order_id: string
          image: null | string
          quantity: number
          price_unit: number
          price_total: number
          date: string
        }[]
        payments: {
          id: string
          order_oid: number
          payment_type: string
          price: number
          transition_code: null | string
          transition_id: null | string
          machineData: string
          created_at: string
          updated_at: string
        }[]
      }>
    >
  }
  post: {
    register: Promise<
      TDefaultRes<{
        success: true
        data: {
          id: string
          fone: string
          email: string
          status: number
          photo: null | string
        }
        token: {
          success: true
          token: string
          roleData: {
            user_id: string
            dt_nascimento: null | string
            cpf: null | string
            fone: string
          }
          user: {
            id: string
            org_id: string
            username: string
            name: string
            role: string
            status: number
            fone: string
          }
        }
      }>
    >
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
