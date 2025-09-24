export type TOrganizer = {
  CNPJ: string
  cashless: boolean
  city: string
  corporateName: string
  createdAt: number
  dbName: string
  devices: string
  eCommerce: {
    adminTax: boolean
    adminTaxMinimum: string
    adminTaxPercentage: string
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
  logoWebstore: string
  name: string
  phone: string
  status: boolean
  taxes: {
    credit: string
    debit: string
    pix: string
  }
  uf: string
  uid: string
  uidUser: string
  webstoreLogoUrl: string
}
