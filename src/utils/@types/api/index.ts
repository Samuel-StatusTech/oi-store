import TParams from "./params"
import TResponses from "./responses"

/*
 * Get
 */

type TApiGetters = {
  qrcode: (p: TParams["get"]["qrcode"]) => TResponses["get"]["qrcode"]
  events: (p: TParams["get"]["events"]) => TResponses["get"]["events"]
  eventInfo: (p: TParams["get"]["eventInfo"]) => TResponses["get"]["eventInfo"]
  products: (p: TParams["get"]["products"]) => TResponses["get"]["products"]
}

/*
 * Create
 */

// type TApiCreates = {
//     product: (p: TParams['create']['product']) => TResponses['create']['product']
// }

export type TApi = {
  get: TApiGetters
  // create: TApiCreates
}
