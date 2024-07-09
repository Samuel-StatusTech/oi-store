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
      username: string
      password: string
    }
  }
}

export default TParams
