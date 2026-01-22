import { TEventData } from "../@types/data/event"
import { TTicketDisposal } from "../@types/data/ticket"
import { formatMoney } from "./formatMoney"

export const sumTickets = (ticketsList: any[]) => {
  let total = 0

  ticketsList.forEach((t) => {
    total += t.price_sell * t.qnt
  })

  return total
}

export const getTicketRelativeTaxes = (props: {
  ticketCost: number
  adminTax: any
  adminTaxValue: any
  adminTaxPercentage: any
  adminTaxMinimum: any
}): {
  value: number
  rule: "fixed" | "percentage" | "min" | "none"
  strComplement: string
} => {
  const {
    ticketCost,
    adminTax,
    adminTaxValue,
    adminTaxPercentage,
    adminTaxMinimum,
  } = props

  let rule: "fixed" | "percentage" | "min" | "none" = "none"

  let ticketTaxes = 0
  const hasTax = adminTax
  const isTaxAbsolute = adminTaxValue !== 0
  const percentage = adminTaxPercentage / 100 / 100

  if (hasTax) {
    if (isTaxAbsolute) {
      rule = "fixed"
      ticketTaxes = adminTaxValue
    } else {
      const taxMin = adminTaxMinimum
      const calculedTax = Math.round(ticketCost * percentage)

      const min = Math.max(taxMin, calculedTax)

      ticketTaxes = min
    }
  }

  const result = {
    value: ticketTaxes,
    rule: rule,
    strComplement:
      rule === "fixed" ? `(${formatMoney(adminTaxValue, true)})` : "",
  }

  return result
}

export const sumTaxes = (props: {
  ticketsTotal?: number
  adminTax: any
  adminTaxValue: any
  adminTaxPercentage: any
  adminTaxMinimum: any
  tickets: TTicketDisposal[]
}): {
  value: number
  rule: "fixed" | "percentage" | "min" | "none"
  strComplement: string
} => {
  const {
    adminTax,
    adminTaxValue,
    adminTaxPercentage,
    adminTaxMinimum,
    tickets,
  } = props

  let rule: "fixed" | "percentage" | "min" | "none" = "none"

  let total = 0
  const hasTax = adminTax
  const isTaxAbsolute = adminTaxValue !== 0
  const percentage = adminTaxPercentage / 100 / 100

  if (hasTax) {
    if (isTaxAbsolute) rule = "fixed"

    const actives = tickets.filter((t) => Boolean(t.active))

    for (let i = 0; i < actives.length; i++) {
      const ticket = tickets[i]

      if (ticket.qnt > 0) {
        for (let i = 0; i < ticket.qnt; i++) {
          if (isTaxAbsolute) total += adminTaxValue
          else {
            const taxMin = adminTaxMinimum
            const calculedTax = Math.round(ticket.price_sell * percentage)

            const min = Math.max(taxMin, calculedTax)

            total += min
          }
        }
      }
    }
  }

  const result = {
    value: total,
    rule: rule,
    strComplement:
      rule === "fixed" ? `(${formatMoney(adminTaxValue, true)})` : "",
  }

  return result
}

export const eventHasTaxes = (event: TEventData) => {
  let has = false

  const shouldChargeClient = event.eCommerce.chargeClient
  const hasTax = event.eCommerce.adminTax
  const isTaxAbsolute = event.eCommerce.adminTaxValue !== 0
  const hasPercentage = event.eCommerce.adminTaxPercentage !== "0"

  const minimum = event.eCommerce.adminTaxMinimum
  const hasMinimum = !Number.isNaN(+minimum) && +minimum > 0

  has =
    shouldChargeClient &&
    hasTax &&
    (isTaxAbsolute || hasPercentage || hasMinimum)

  return has
}
