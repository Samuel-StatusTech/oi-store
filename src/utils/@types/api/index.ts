import TParams from "./params"
import TResponses from "./responses"

/*
 * Get
 */

type TApiGetters = {
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
