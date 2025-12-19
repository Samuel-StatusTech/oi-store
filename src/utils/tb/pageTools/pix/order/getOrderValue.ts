import { TUser } from "../../../../@types/data/user"
import { getOrderData } from "../../../order"

export const getOrderValue = (
  currentTickets: any[],
  currentBuyer: any,
  taxTotal: any,
  sid: string,
  user: TUser,
  dk: string,
  eventId: string,
  eventName: string
) => {
  const obj = getOrderData({
    tickets: currentTickets,
    buyer: currentBuyer,
    taxTotal: !Number.isNaN(+taxTotal) ? Number(taxTotal) : 0,
    sid,
    user: user,
    dk: dk,
    eventId: eventId,
    eventName: eventName,
  })

  return obj ? obj.transaction_amount : 0
}
