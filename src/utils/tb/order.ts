import { baseBackUrl } from "../../api"
import { TTicket } from "../@types/data/ticket"

type Props = {
  tickets: TTicket[]
  buyer: {
    name: string
    phone: string
  }
  taxTotal: number
}

export const getOrderData = ({ tickets, buyer, taxTotal }: Props) => {
  if (tickets) {
    const paymentValue =
      tickets.reduce((sum, ticket) => sum + +(ticket.price_sell ?? "0"), 0) +
      taxTotal

    const phone = buyer.phone.replace(/\D/g, "")

    let items = [
      ...tickets.map((t) => ({
        name: t.name,
        quantity: 1,
        unit_amount: +(t.price_sell ?? "0"),
      })),
    ]

    if (taxTotal > 0)
      items.push({
        name: "Taxes",
        quantity: 1,
        unit_amount: taxTotal,
      })

    const obj = {
      customer: {
        name: buyer?.name ?? "Lorem ipsum",
        email: "null@null.null",
        phones: [
          {
            country: "55",
            area: phone.slice(0, 2),
            number: phone.slice(2),
            type: "MOBILE",
          },
        ],
        tax_id: "12345678909",
      },
      items,
      qr_codes: [{ amount: { value: paymentValue, arrangements: "PAGBANK" } }],
      notification_urls: [`${baseBackUrl}api/orders/orderUpdate`],
    }

    return obj
  } else return null
}
