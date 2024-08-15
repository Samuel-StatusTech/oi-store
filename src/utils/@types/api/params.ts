type TParams = {
  // Get
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
        reference_id?: string
      }
    }
    events: {}
    eventInfo: {
      eventId: string
    }
    products: {
      eventId: string
    }
    myTickets: {}
  }

  // Post
  post: {
    login: {
      requestCode: { phone: string }
      validateCode: { phone: string; code: string }
    }
    purchase: {
      sign: {
        order_id: string
        event_id: string
        products: TPurchaseProduct[]
        payments: TPurchasePayment[]
      }
      mpGenerate: any
      confirm: {
        order_id: string
        payment_code: string
        order_number: number
      }
    }
  }
}

type TPurchasePayment = {
  payment_type: string
  price: number
  transitionCode: string | null
  transitionId: string | null
}

type TPurchaseProduct = {
  batch_id: string
  id: string
  price_sell: string
  quantity: number
}

export default TParams
