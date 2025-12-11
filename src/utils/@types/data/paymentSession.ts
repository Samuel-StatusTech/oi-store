export type TPaymentSession = {
  order_oid: number
  socketId: string
  paymentId: string
  qrCode: string
  qrCode64: string
  paymentStartedAt: string
}
