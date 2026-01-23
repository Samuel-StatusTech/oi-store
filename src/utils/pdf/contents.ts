import { TEventData } from "../@types/data/event"
import { TShoppingTicket } from "../@types/data/ticket"
import { getDateString } from "../tb/date"
import { formatMoney } from "../tb/formatMoney"
import { getFormattedRegister } from "../tb/formatters/getFormattedRegister"
import { monthsRelations } from "../tb/getDatePeriod"

export const reportTitle = [
  {
    image: "",
    margin: [0, 28, 17, 0],
    width: 170,
    style: { alignment: "right" },
  },
]

export const footer = (event: TEventData) => [
  {
    text: [
      {
        text: `Razão Social: `,
        fontSize: 10,
        style: "companyFooterTag",
      },
      {
        text: `${event.corporateName}          `,
        fontSize: 10,
        style: "companyFooter",
      },
      {
        text: `CNPJ: `,
        fontSize: 10,
        style: "companyFooterTag",
      },
      {
        text: `${getFormattedRegister(event.CNPJ)}`,
        fontSize: 10,
        style: "companyFooter",
      },
    ],
    margin: [38, 0, 10, -12],
  },
  {
    text: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
    fontSize: 10,
    style: "dateFooter",
    margin: [0, 0, 38, 0],
    width: ["*"],
  },
]

const formatdM = (date: string | number | Date) => {
  let str = ""

  const dt = new Date(date)

  const d = String(dt.getUTCDate()).padStart(2, "0")
  const m = dt.getUTCMonth()

  str += `${d} de ${monthsRelations[m]}`

  return str
}

const formatHour = (str?: string) => {
  if (!str) return "Dia todo"
  else {
    const _d = new Date()

    const dateStr = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, "0")}-${String(_d.getDate()).padStart(2, "0")}T${str}.000Z`

    const formattedHour = new Date(dateStr).toLocaleTimeString()

    return formattedHour.slice(0, 5)
  }
}

const ticketData = (
  event: TEventData,
  ticket: TShoppingTicket & {
    user_name?: string
    tax_value?: number
    TRN?: string
  },
  ticketsLength: number,
  newPage: boolean,
) => {
  let data: any[] = []
  let body = []

  try {
    const hours = formatHour(event.time_ini)

    const hasValidEndDate = Boolean(event.date_end && event.date_end !== "" && new Date(event.date_end).getTime() >= new Date(event.date_ini).getTime())

    const eventDateText =
      event.date_end === event.date_ini || !hasValidEndDate
        ? formatdM(event.date_ini)
        : `${formatdM(event.date_ini)} até ${formatdM(event.date_end)}`

    const eventInfo = {
      pageBreak: newPage ? "before" : undefined,
      style: "eventTable",
      table: {
        body: [
          // event
          [{ text: event.name, bold: true }],
          [
            {
              text: `Data do evento: ${eventDateText}`,
            },
          ],
          [{ text: `Início do evento: ${hours}` }],
          [{ text: `Local: ${event.local}. ${event.city}, ${event?.uf}` }],
        ],
        widths: ["*"],
      },
      layout: {
        hLineColor: function (i: number, node: any) {
          return "#dedede"
        },
        vLineColor: function (i: number, node: any) {
          return "#dedede"
        },
        hLineWidth: function (i: number, node: any) {
          return i === 0 || i === node.table.body.length ? 1 : 0
        },
        vLineWidth: function (i: number, node: any) {
          return i === 0 || i === node.table.widths.length ? 1 : 0
        },
        hLineStyle: function (i: number, node: any) {
          if (i === 0 || i === node.table.body.length) {
            return null
          }
          return { dash: { length: 10, space: 4 } }
        },
        vLineStyle: function (i: number, node: any) {
          if (i === 0 || i === node.table.widths.length) {
            return null
          }
          return { dash: { length: 4 } }
        },
        paddingLeft: function () {
          return 10
        },
        paddingRight: function () {
          return 10
        },
        paddingTop: function (i: number) {
          return i === 0 ? 10 : 2
        },
        paddingBottom: function (i: number) {
          return i === ticketsLength - 1 ? 10 : 2
        },
      },
    }

    // event
    body.push(eventInfo)

    // ticket

    let tableBody: any[] = [
      [{ text: "Ingresso", bold: true, style: "tableTitle" }],
      [
        {
          text: `Comprado dia ${getDateString("full", ticket.date)}`,
          style: "purchaseDate",
        },
      ],
      ...(ticket.buyer_name
        ? [
            [
              {
                text: `Comprado por ${ticket.buyer_name}`,
                style: "purchaseDate",
              },
            ],
          ]
        : []),
      [
        {
          text: `${ticket.batch_name ?? ""} - ${ticket.name}`,
        },
      ],
      [
        {
          text: `PREÇO: ${formatMoney(
            ticket.price_unit * ticket.quantity,
            true,
          )}`,
        },
      ],
      ...(event.eCommerce.chargeClient
        ? [
            [
              {
                text: `TAXA: ${formatMoney(ticket.tax_value as number, true)}`,
              },
            ],
          ]
        : []),
    ]

    // nominal
    if (Boolean(event.nominal)) {
      // @ts-ignore
      const ticketUserName = ticket.user ?? ticket.ticket_name ?? null

      if (ticketUserName) {
        tableBody.push([
          { text: "Participante", bold: true, margin: [0, 16, 0, 0] },
        ])
        tableBody.push([
          { text: ticketUserName ?? "Não especificado", margin: [0, 0, 0, 16] },
        ])
      }
    }

    tableBody.push([
      {
        qr: `${ticket.qr_data}`,
        style: "qrcode",
      },
    ]) // ticket.qr_data only
    tableBody.push([
      {
        text: ticket.qr_label,
        style: "qrcodetext",
      },
    ]) // ticket.qr_data only

    tableBody.push([
      {
        text: `Referência: ${ticket.TRN}`,
      },
    ])

    body.push({
      style: "eventTable",
      table: {
        body: tableBody,
        widths: ["*"],
      },
      layout: {
        hLineColor: function (i: number, node: any) {
          return "#dedede"
        },
        vLineColor: function (i: number, node: any) {
          return "#dedede"
        },
        hLineWidth: function (i: number, node: any) {
          return i === 0 || i === node.table.body.length ? 1 : 0
        },
        vLineWidth: function (i: number, node: any) {
          return i === 0 || i === node.table.widths.length ? 1 : 0
        },
        hLineStyle: function (i: number, node: any) {
          if (i === 0 || i === node.table.body.length) {
            return null
          }
          return { dash: { length: 10, space: 4 } }
        },
        vLineStyle: function (i: number, node: any) {
          if (i === 0 || i === node.table.widths.length) {
            return null
          }
          return { dash: { length: 4 } }
        },
        paddingLeft: function (i: number) {
          return i === 0 ? 10 : 0
        },
        paddingRight: function () {
          return 10
        },
        paddingTop: function (i: number) {
          return i === 0 ? 5 : i === 1 ? 10 : 2
        },
        paddingBottom: function (i: number) {
          return i === 0 ? 5 : 2 // and last item
        },
      },
    })

    // info
    body.push({
      style: "eventTable",
      table: {
        body: [
          // event
          [{ text: "INFORMAÇÕES IMPORTANTES", bold: true }],
          [{ text: "", style: "infoAnswer" }],
          [
            {
              text: "1. Esse documento já é seu Ingresso Digital.",
              style: "infoAnswer",
            },
          ],
          [
            {
              text: "2. No dia do evento, basta apresentar o QR Code na portaria (impresso ou no celular).",
              style: "infoAnswer",
            },
          ],
          [{ text: "", style: "infoAnswer" }],
          [
            {
              text: "*** Comprei para mais pessoas. Preciso chegar junto?",
              style: "infoQuestion",
            },
          ],
          [
            {
              text: "Não precisa. Cada ingresso é único e possui seu prório QR Code, podendo ser validado sozinho.",
              style: "infoAnswer",
            },
          ],
          [{ text: "", style: "infoAnswer" }],
          [{ text: "*** Posso imprimir os ingressos?", style: "infoQuestion" }],
          [
            {
              text: "Não é necessário, mas se preferir pode imprimir seus ingressos em uma impressora comum (Papel A4 com fundo branco).",
              style: "infoAnswer",
            },
          ],
        ],
        widths: ["*"],
      },
      layout: {
        hLineColor: function (i: number, node: any) {
          return "#dedede"
        },
        vLineColor: function (i: number, node: any) {
          return "#dedede"
        },
        hLineWidth: function (i: number, node: any) {
          return i === 0 || i === node.table.body.length ? 1 : 0
        },
        vLineWidth: function (i: number, node: any) {
          return i === 0 || i === node.table.widths.length ? 1 : 0
        },
        hLineStyle: function (i: number, node: any) {
          if (i === 0 || i === node.table.body.length) {
            return null
          }
          return { dash: { length: 10, space: 4 } }
        },
        vLineStyle: function (i: number, node: any) {
          if (i === 0 || i === node.table.widths.length) {
            return null
          }
          return { dash: { length: 4 } }
        },
        paddingLeft: function () {
          return 10
        },
        paddingRight: function () {
          return 10
        },
        paddingTop: function (i: number) {
          return i === 0 ? 10 : 2
        },
        paddingBottom: function (i: number) {
          return i === 9 ? 10 : 2
        },
      },
    })

    data = body
  } catch (error) {}

  return data
}

export const content = (event: TEventData, tickets: TShoppingTicket[]) => {
  let data: any[] = []

  // Event content
  data = [
    ...data,
    tickets.map((t, i) => ticketData(event, t, tickets.length, i > 0)),
  ]

  return data
}
