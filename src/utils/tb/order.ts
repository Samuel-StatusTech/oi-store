import { TTicket } from "../@types/data/ticket"

type Props = {
  tickets: TTicket[]
  buyer: {
    name: string
    phone: string
  }
  taxTotal: number
  sid: string
}

export const getOrderData = ({ tickets, buyer, taxTotal, sid }: Props) => {
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
      transaction_amount: paymentValue / 100,
      payment_method_id: "pix",
      // description: "",
      payer: {
        first_name: "Developer",
        last_name: "test",
        email: "samdg919@gmail.com",
        // type: "guest",
      },
      metadata: {
        payer: {
          phone: {
            area_code: phone.slice(0, 2),
            number: phone.slice(2),
          },
        },
        cCode: sid,
      },
      // items
    }

    return obj
  } else return null
}
