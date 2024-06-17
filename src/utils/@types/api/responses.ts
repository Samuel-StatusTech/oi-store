import { TEventData, TEventMin } from "../data/event"
import { TProduct } from "../data/product"

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
    events: Promise<TDefaultRes<TEventMin[]>>
    eventInfo: Promise<TDefaultRes<TEventData>>
    products: Promise<
      TDefaultRes<{
        list: TProduct[]
      }>
    >
  }
  create: {
    product: Promise<
      TDefaultRes<{
        createdProduct: TProduct
      }>
    >
  }
}

export default TResponses
