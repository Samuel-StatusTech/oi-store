export const sumTickets = (ticketsList: any[]) => {
  let total = 0

  ticketsList.forEach((t) => {
    total += t.price_sell * t.qnt
  })

  return total
}

export const sumTaxes = ({
  ticketsTotal,
  adminTax,
  adminTaxValue,
  adminTaxPercentage,
  adminTaxMinimum,
}: {
  ticketsTotal: number
  adminTax: any
  adminTaxValue: any
  adminTaxPercentage: any
  adminTaxMinimum: any
}) => {
  let total = 0
  const hasTax = adminTax
  const isTaxAbsolute = adminTaxValue !== 0

  if (hasTax) {
    if (isTaxAbsolute) total = +adminTaxValue
    else {
      const percentage = +adminTaxPercentage / 100 / 100
      const taxMin = +adminTaxMinimum
      const calculedTax = Math.round(ticketsTotal * percentage)

      const min = Math.max(taxMin, calculedTax)
      total = min
    }
  }

  return total
}
