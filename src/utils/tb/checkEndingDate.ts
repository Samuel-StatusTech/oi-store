import { TEventMin } from "../@types/data/event"

export const checkEndingDate = (event: TEventMin): boolean => {
  if (!Boolean(event.has_ending)) return true

  const localTimezone = new Date().getTimezoneOffset()

  const now = new Date().getTime()
  const endingHours = new Date(event.ending as string).getHours()
  const ending = new Date(event.ending as string).setHours(
    endingHours + localTimezone / 60
  )

  return now <= ending
}
