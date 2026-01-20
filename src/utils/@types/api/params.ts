type TParams = {
  // Get
  get: {
    subdomainStatus: {}
    qrcode: {
      order: {
        external_reference: string
        transaction_amount: number
        payment_method_id: "pix"
        payer: {
          first_name: string
          last_name: string
          email?: string
        }
        metadata: {
          socketId: string
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
        items?: any[]
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
    orderPaymentStatus: {
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
      requestCode: { phone: string; avoidSms?: boolean; dk?: string }
      validateCode: {
        phone: string
        code: string
        email?: string
        name?: string
        dk?: string
      }
    }
    purchase: {
      sign: {
        buyer_name: string
        buyer_email: string
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

        buyerName: string
        organizerName: string
        organizerDocument: string

        purchaseCode: string
        purchaseTime: string
        purchaseValue: string
        purchaseTaxes: string
        purchaseItems: string
        purchaseStatus: string

        targetEmail: string
      }
    }
    whatsapp: {
      sendWhatsapp: {
        targetPhone: string
        base64File: string
        fileName: string
        caption: string
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
