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
  purchaseInfo: (
    p: TParams["get"]["purchaseInfo"]
  ) => TResponses["get"]["purchaseInfo"]
  orderPaymentStatus: (
    p: TParams["get"]["orderPaymentStatus"]
  ) => TResponses["get"]["orderPaymentStatus"]
}

/*
 * Create
 */

type TApiPosters = {
  register: (p: TParams["post"]["register"]) => TResponses["post"]["register"]
  login: {
    requestCode: (
      p: TParams["post"]["login"]["requestCode"]
    ) => TResponses["post"]["login"]["requestCode"]
    validateCode: (
      p: TParams["post"]["login"]["validateCode"]
    ) => TResponses["post"]["login"]["validateCode"]
  }
  purchase: {
    sign: (
      p: TParams["post"]["purchase"]["sign"]
    ) => TResponses["post"]["purchase"]["sign"]
    mpGenerate: (
      p: TParams["post"]["purchase"]["mpGenerate"]
    ) => TResponses["post"]["purchase"]["mpGenerate"]
    confirm: (
      p: TParams["post"]["purchase"]["confirm"]
    ) => TResponses["post"]["purchase"]["confirm"]
  }
  mail: {
    sendEmail: (
      p: TParams["post"]["mail"]["sendEmail"]
    ) => TResponses["post"]["mail"]["sendEmail"]
  }
}

export type TApi = {
  get: TApiGetters
  post: TApiPosters
}
