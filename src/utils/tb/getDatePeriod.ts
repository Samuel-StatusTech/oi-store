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

  const isEndDateValid = !(endDate instanceof Date && !isNaN(endDate.valueOf())) || endDate.getUTCFullYear() > 1970

  const isMultipleDays = iniDate.getTime() !== endDate.getTime() && isEndDateValid

  if (isMultipleDays) {

    str = `De ${String(iniDate.getUTCDate()).padStart(2, "0")}`

    if (iniDate.getUTCMonth() !== endDate.getUTCMonth()) str += ` de ${monthsRelations[iniDate.getMonth()]}`
    if (iniDate.getUTCFullYear() !== endDate.getUTCFullYear()) str += ` de ${iniDate.getUTCFullYear()}`

    str += ` a ${String(endDate.getUTCDate()).padStart(2, "0")}`
    str += ` de ${monthsRelations[endDate.getMonth()]}`
    str += ` de ${endDate.getUTCFullYear()}`

  } else {

    str = String(iniDate.getUTCDate()).padStart(2, "0")
    str += ` de ${monthsRelations[iniDate.getMonth()]}`
    str += ` de ${iniDate.getUTCFullYear()}`

  }

  return str
}

export const getHours = (date: Date) => {
  let str = ""

  str += String(date.getHours()).padStart(2, "0")
  str += ":"
  str += String(date.getMinutes()).padStart(2, "0")

  return str
}
