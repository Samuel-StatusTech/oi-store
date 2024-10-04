import { TTicketDisposal } from "../@types/data/ticket"

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
  tickets,
}: {
  ticketsTotal: number
  adminTax: any
  adminTaxValue: any
  adminTaxPercentage: any
  adminTaxMinimum: any
  tickets: TTicketDisposal[]
}) => {
  let total = 0
  const hasTax = adminTax
  const isTaxAbsolute = adminTaxValue !== 0

  if (hasTax) {
    const actives = tickets.filter((t) => Boolean(t.active))

    for (let i = 0; i < actives.length; i++) {
      const ticket = tickets[i]

      if (ticket.qnt > 0) {
        for (let i = 0; i < ticket.qnt; i++) {
          if (isTaxAbsolute) total += +adminTaxValue
          else {
            const percentage = +adminTaxPercentage / 100 / 100
            const taxMin = +adminTaxMinimum
            const calculedTax = Math.round(ticket.price_sell * percentage)

            const min = Math.max(taxMin, calculedTax)

            total += min
          }
        }
      }
    }
  }

  return total
}
