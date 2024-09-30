import { monthsRelations } from "./getDatePeriod"

type TFormat = "dM" | "dMy" | "full" | "pdf"

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

const formatPdf = (date: Date | string) => {
  let str = ""

  try {
    const split = (date as string).split("-")

    const _d = new Date(date)

    if (
      Number.isNaN(+split[0]) ||
      Number.isNaN(+split[1]) ||
      Number.isNaN(+split[2].slice(0, 2))
    ) {
      throw new Error()
    }

    const d = new Date(
      Date.UTC(
        +split[0],
        +split[1],
        +split[2].slice(0, 2),
        _d.getTimezoneOffset() / 60,
        0,
        0
      )
    )

    // day
    str = String(d.getDate()).padStart(2, "0")

    // month
    str += `/${String(d.getMonth() + 1).padStart(2, "0")}`

    // year
    str += `/${d.getFullYear()}`
  } catch (error) {
    const _d = new Date(date)
    const d = new Date(
      Date.UTC(
        _d.getFullYear(),
        _d.getMonth(),
        _d.getDate(),
        _d.getTimezoneOffset() / 60,
        0,
        0
      )
    )

    // day
    str = String(d.getDate()).padStart(2, "0")

    // month
    str += `/${String(d.getMonth() + 1).padStart(2, "0")}`

    // year
    str += `/${d.getFullYear()}`
  }

  return str
}

const relations: {
  [key in TFormat]: (date: Date | string) => string
} = {
  dM: formatdM,
  dMy: formatdMy,
  full: formatFull,
  pdf: formatPdf,
}

export const getDateString = (format: TFormat, date: Date | string) => {
  let str = relations[format](date)
  return str
}
