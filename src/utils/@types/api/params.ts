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
        payment_method_id: string
        transaction_amount: number
      }
    }
    events: {}
    eventInfo: {
      eventId: string
    }
    myTickets: {
      eventId: string
    }
    products: {
      eventId: string
    }
    purchaseInfo: {
      eventId: string
      orderId: string
    }
  }

  // Post
  post: {
    register: {
      name: string
      phone: string
      email: string
    }
    login: {
      requestCode: { phone: string }
      validateCode: { phone: string; code: string }
    }
    purchase: {
      sign: {
        user_fone: string
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
