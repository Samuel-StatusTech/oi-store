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
  myTickets: (p: TParams["get"]["myTickets"]) => TResponses["get"]["myTickets"]
}

/*
 * Create
 */

type TApiPosters = {
  login: (p: TParams["post"]["login"]) => TResponses["post"]["login"]
}

export type TApi = {
  get: TApiGetters
  post: TApiPosters
}
