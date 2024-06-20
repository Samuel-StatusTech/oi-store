export type TQrPaymentData = {
  id: string
  reference_id: string
  created_at: string
  customer: {
    name: string
    email: string
    tax_id: string
    phones: [
      {
        type: string
        country: string
        area: string
        number: string
      }
    ]
  }
  items: [
    {
      name: string
      quantity: number
      unit_amount: number
    }
  ]
  qr_codes: [
    {
      id: string
      expiration_date: string
      amount: {
        value: number
      }
      text: string
      arrangements: [string]
      links: [
        {
          rel: string
          href: string
          media: string
          type: string
        },
        {
          rel: string
          href: string
          media: string
          type: string
        }
      ]
    }
  ]
  notification_urls: [string]
  links: [
    {
      rel: string
      href: string
      media: string
      type: string
    },
    {
      rel: string
      href: string
      media: string
      type: string
    }
  ]
}
