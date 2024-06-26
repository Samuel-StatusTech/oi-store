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
  post: {
    login: {
      username: string
      password: string
    }
  }
}

export default TParams
