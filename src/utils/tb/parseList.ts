import { TEventMin } from "../@types/data/event"
import { TCardEvent } from "../@types/data/eventCard"
import { getDatePeriod } from "./getDatePeriod"

const parseEventMinToCard = (minList: TEventMin[]): TCardEvent[] => {
  let newList: TCardEvent[] = []

  minList.forEach((event) => {
    newList.push({
      id: event.id,
      banner: event.event_banner,
      dateStr: getDatePeriod(event.date_ini, event.date_end),
      name: event.name,
    })
  })

  return newList
}

export const parseList = {
  eventMinToEventCard: parseEventMinToCard,
}
