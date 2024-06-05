export type TEventData = {
  date_ini?: string
  date_end?: string
  CNPJ: string
  cashless: boolean
  city: string
  corporateName: string
  createdAt: number
  dbName: string
  devices: string
  eCommerce: {
    adminTax: boolean
    adminTaxMinimum: number
    adminTaxPercentage: number
    adminTaxValue: number
    chargeClient: boolean
    credit: boolean
    gatewayToken: string
    hasSplit: boolean
    pix: boolean
    splitPercentage: number
    splitValue: number
  }
  email: string
  expireAt: number
  hasECommerce: boolean
  logoFixed: string
  name: string
  phone: string
  status: boolean
  taxes: {
    credit: number
    debit: number
    pix: number
  }
  uf: string
  uid: string
  uidUser: string
}
