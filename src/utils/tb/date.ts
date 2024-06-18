import { monthsRelations } from "./getDatePeriod"

type TFormat = "dM" | "dMy" | "full"

// Formatters

const formatdM = (date: Date | string) => {
  let str = ""

  const d = new Date(date)

  // day
  str = String(d.getDate()).padStart(2, "0")

  // month
  str += ` de ${monthsRelations[d.getMonth()]}`

  return str
}

const formatdMy = (date: Date | string) => {
  let str = ""

  const d = new Date(date)

  // day
  str = String(d.getDate()).padStart(2, "0")

  // month
  str += ` de ${monthsRelations[d.getMonth()]}`

  // year
  str += ` de ${d.getFullYear()}`

  return str
}

const formatFull = (date: Date | string) => {
  let str = ""

  const d = new Date(date)

  // day
  str = String(d.getDate()).padStart(2, "0")

  // month
  str += `/${String(d.getMonth() + 1).padStart(2, "0")}`

  // year
  str += `/${d.getFullYear()}`

  // time
  str += ` ${String(d.getHours()).padStart(2, "0")}:`
  str += `${String(d.getMinutes()).padStart(2, "0")}:`
  str += `${String(d.getSeconds()).padStart(2, "0")}`

  return str
}

const relations: {
  [key in TFormat]: (date: Date | string) => string
} = {
  dM: formatdM,
  dMy: formatdMy,
  full: formatFull,
}

export const getDateString = (format: TFormat, date: Date | string) => {
  let str = relations[format](date)
  return str
}
