import { TProduct } from "../data/product"

type TParams = {
  get: {
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
