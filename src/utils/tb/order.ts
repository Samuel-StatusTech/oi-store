import TParams from "../@types/api/params"
import { TTicket } from "../@types/data/ticket"
import { TUser } from "../@types/data/user"

type Props = {
  tickets: TTicket[]
  buyer: {
    name: string
    phone: string
  }
  taxTotal: number
  sid: string
  external_reference?: string
  user: TUser
  dk: any
  eventId: string
}

export const getOrderData = (
  props: Props
): TParams["get"]["qrcode"]["order"] | null => {
  const {
    tickets,
    buyer,
    taxTotal,
    sid,
    external_reference,
    user,
    dk,
    eventId,
  } = props

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

    const obj: TParams["get"]["qrcode"]["order"] = {
      external_reference: external_reference ?? "",
      transaction_amount: paymentValue,
      payment_method_id: "pix",
      // description: "",
      payer: {
        first_name: user.name,
        last_name: user.username,
        email: user.email ?? "email@email.com",
        // type: "guest",
      },
      metadata: {
        socketId: sid,
        payer: {
          phone: {
            area_code: phone.slice(0, 2),
            number: phone.slice(2),
          },
        },
        cCode: sid,
        dk,
        eventId,
      },
      // items
    }

    return obj
  } else return null
}
