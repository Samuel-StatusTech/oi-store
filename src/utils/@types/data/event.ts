export type TEventData = {
  id: string
  org_id: string
  name: string
  description: string
  description2: string
  logo: string
  logo_print: string
  date_ini: string
  time_ini: string
  date_end: string
  local: string
  city: string
  state: string
  days: number
  status: boolean
  is_ecommerce: boolean
  print_valid: number
  print_logo: number
  has_cashless: number
  has_tax_active: number
  allow_cashback: number
  has_tax_cashback: number
  tax_active: number
  tax_payback_cash: number
  tax_payback_percent: number
  created_at: string
  updated_at: string
  archived: number
  oid: number
  order_number: number
  event_banner_vertical: string
  event_banner: string
  event_map: string
  address: string
  hotsite_address: string
  nominal: number
  CNPJ: string
  cashless: boolean
  corporateName: string
  corporateFantasyName: string
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
  logoWebstoreUrl: string
  webstoreLogoUrl: string
  phone: string
  taxes: {
    credit: string | number
    debit: string | number
    pix: string | number
  }
  uf: string
  uid: string
  uidUser: string
  dk: any

  has_age: number
  age: string | number
  has_ending: number
  ending: string
  keep_sells_online: boolean
  keep_out_sells_online_message?: string
}

export type TEventMin = {
  id: string
  org_id: string
  name: string
  description: string
  logo: string | null
  logo_print: string | null
  date_ini: string
  time_ini: string
  date_end: string
  local: string
  city: string
  state: string
  days: number
  status: number
  print_valid: number
  print_logo: number
  has_cashless: number
  has_tax_active: number
  allow_cashback: number
  has_age: number
  age: number | null
  has_ending: number
  ending: string | null // "YYYY-MM-DDT12:34:56.000Z"
  keep_sells_online: number
  has_tax_cashback: number
  tax_active: number
  tax_payback_cash: number
  tax_payback_percent: number
  created_at: string // "YYYY-MM-DDT12:34:56.000Z"
  updated_at: string // "YYYY-MM-DDT12:34:56.000Z"
  archived: number
  oid: number
  order_number: number
  event_banner: string | null
  event_map: string | null
  address: string
  hotsite_address: string
  nominal: number
  description2: string
  keep_out_sells_online_message: string
  is_ecommerce: number
  event_banner_vertical: string | null
}
