export const monthsRelations = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
]

export const getDatePeriod = (date_ini: string, date_end: string) => {
  let str = ""

  const [iniDate, endDate] = [new Date(date_ini), new Date(date_end)]

  const isMultipleDays = iniDate.getTime() !== endDate.getTime()

  if (isMultipleDays) {
    str = `De ${String(iniDate.getUTCDate()).padStart(2, "0")}`
    str += ` a ${String(endDate.getUTCDate()).padStart(2, "0")}`
  } else str = String(iniDate.getUTCDate()).padStart(2, "0")

  str += ` de ${monthsRelations[endDate.getMonth()]}`
  str += ` de ${endDate.getFullYear()}`

  return str
}

export const getHours = (date: Date) => {
  let str = ""

  str += String(date.getHours()).padStart(2, "0")
  str += ":"
  str += String(date.getMinutes()).padStart(2, "0")

  return str
}
