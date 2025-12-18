import { formatDate } from "date-fns"
import pageToolsPix from ".."
import { TEventData } from "../../../../@types/data/event"
import { getHours } from "../../../getDatePeriod"
import { Api } from "../../../../../api"
import { TUser } from "../../../../@types/data/user"

export const sendEmail = async (
  event: TEventData,
  user: TUser,
  purchaseValue: number,
  currentTickets: any[],
  purchaseInfo: {
    status: string
    amount: number
    message: string
    sId: string
    transition_id: string
    time: string
  },
  productsList: any[],
  targetEmail: string
) => {
  try {
    // Mail Data
    const startAt = event?.date_ini
      ? getHours(
          new Date(
            event?.date_ini.slice(0, event?.date_ini.indexOf("T")) +
              "T" +
              event?.time_ini +
              ".000Z"
          )
        )
      : event?.time_ini
      ? event.time_ini.slice(0, 5)
      : "Dia todo"

    let list: any[] = []

    currentTickets.forEach((i: any) => {
      const idx = list.findIndex((li) => li.name.includes(i.ticketName))
      if (idx < 0) {
        list.push({
          name: i.ticketName,
          total: i.quantity,
        })
      } else {
        list[idx] = {
          ...list[idx],
          total: list[idx].total + i.quantity,
        }
      }
    })

    list = list.map((i) => ({
      text: `${i.name} (${i.total})`,
      total: i.total,
    }))

    const mailInfo: any = {
      logo: await pageToolsPix.getLogoFile(event as TEventData),
      file: await pageToolsPix.getPdfFile(event as TEventData, productsList),
      logoWebstoreUrl: event?.logoWebstoreUrl ?? event?.logoFixed,

      eventName: event?.name,
      eventDate: formatDate(event?.date_ini as string, "dd/MM/yyyy"),
      eventTime: startAt,
      eventLocal: event?.local,

      purchaseCode: purchaseInfo?.transition_id,
      purchaseTime: formatDate(
        purchaseInfo.time as string,
        "dd/MM/yyyy HH:mm:ss"
      ),
      purchaseValue: purchaseValue,
      purchaseItems: JSON.stringify(list),
      purchaseStatus: "Pago",

      targetEmail: targetEmail,
    }

    await Api.post.mail.sendEmail(mailInfo)
  } catch (error) {}
}
