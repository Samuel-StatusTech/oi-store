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
  post: {
    login: {
      requestCode: { phone: string }
      validateCode: { phone: string; code: string }
    }
    order: {
      confirm: {
        eventId: string
        paymentCode: string
        orderId: string
      }
    }
  }
}

export default TParams
