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
  login: {
    requestCode: (
      p: TParams["post"]["login"]["requestCode"]
    ) => TResponses["post"]["login"]["requestCode"]
    validateCode: (
      p: TParams["post"]["login"]["validateCode"]
    ) => TResponses["post"]["login"]["validateCode"]
  }
  order: {
    confirm: (
      p: TParams["post"]["order"]["confirm"]
    ) => TResponses["post"]["order"]["confirm"]
  }
}

export type TApi = {
  get: TApiGetters
  post: TApiPosters
}
