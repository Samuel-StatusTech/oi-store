import { TProduct } from "../data/product"

type TParams = {
  get: {
    qrcode: {
      order: {
        items: {
          name: string
          quantity: number
          unit_amount: number
        }[]
        qr_codes: {
          amount: {
            value: number
          }
        }[]
      }
    }
    events: {}
    eventInfo: {
      eventId: string
    }
    products: {
      eventId: string
    }
  }
  create: {
    product: {
      eventId: string
      prod: Partial<TProduct>
    }
  }
}

export default TParams
