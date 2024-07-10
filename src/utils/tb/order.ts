import { TTicket } from "../@types/data/ticket"

type Props = {
  tickets: TTicket[]
  buyer: {
    name: string
    phone: string
  }
}

export const getOrderData = ({ tickets, buyer }: Props) => {
  if (tickets) {
    const paymentValue = tickets.reduce(
      (sum, ticket) => sum + +(ticket.price_sell ?? "0"),
      0
    )

    const phone = buyer.phone.replace(/\D/g, "")

    const obj = {
      customer: {
        name: buyer?.name ?? "Lorem ipsum",
        email: "null@null.null",
        phones: [{
          country: "55",
          area: phone.slice(0, 2),
          number: phone.slice(2),
          type: "MOBILE",
        }],
        tax_id: "12345678909",
      },
      items: tickets.map((t) => ({
        name: t.name,
        quantity: 1,
        unit_amount: +(t.price_sell ?? "0"),
      })),
      qr_codes: [{ amount: { value: paymentValue, arrangements: "PAGBANK" } }],
      notification_urls: [
        "https://back-moreira.vercel.app/api/orders/orderUpdate",
      ],
    }

    return obj
  } else return null
}
