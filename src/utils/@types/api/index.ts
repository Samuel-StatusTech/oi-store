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

type TApiPosters = {
    login: (p: TParams['post']['login']) => TResponses['post']['login']
}

export type TApi = {
  get: TApiGetters
  post: TApiPosters
}
