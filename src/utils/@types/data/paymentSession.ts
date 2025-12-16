export type TPaymentSession = {
  extref: string
  socketId: string
  paymentId: string
  qrCode: string
  qrCode64: string
  paymentStartedAt: string
  amount: number
}
