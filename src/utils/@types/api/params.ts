type TParams = {
  // Get
  get: {
    qrcode: {
      order: {
        transaction_amount: number
        payment_method_id: "pix"
        payer: {
          first_name: string
          last_name: string
          email: string
        }
        metadata: {
          payer: {
            phone: {
              area_code: string
              number: string
            }
          }
          cCode: string
          dk: string
          eventId: string
        }
        buyerName?: string
      }
    }
    events: {}
    eventInfo: {
      eventId: string
    }
    myTickets: {
      eventId: string
      eventName: string
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
      requestCode: { phone: string; avoidSms?: boolean }
      validateCode: {
        phone: string
        code: string
        email?: string
        name?: string
      }
    }
    purchase: {
      sign: {
        buyer_name: string
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
    mail: {
      sendEmail: {
        file: string | File
        logo: string | File
        logoWebstoreUrl: string

        eventName: string
        eventDate: string
        eventTime: string
        eventLocal: string

        purchaseCode: string
        purchaseTime: string
        purchaseValue: string
        purchaseItems: string
        purchaseStatus: string

        targetEmail: string
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
