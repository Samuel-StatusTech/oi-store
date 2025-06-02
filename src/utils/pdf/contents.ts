import { TEventData } from "../@types/data/event"
import { TShoppingTicket } from "../@types/data/ticket"
import { formatCNPJ } from "../masks/cnpj"
import { getDateString } from "../tb/date"
import { formatMoney } from "../tb/formatMoney"

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
        text: `${formatCNPJ(event.CNPJ)}`,
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

const ticketData = (
  event: TEventData,
  ticket: TShoppingTicket & {
    user_name?: string
    tax_value?: number
    TRN?: string
  },
  ticketsLength: number,
  newPage: boolean
) => {
  let data: any[] = []
  let body = []

  try {
    const getHours = (date: string) => {
      let str = ""

      const d = new Date(date)

      str = `${String(d.getHours()).padStart(2, "0")}:`
      str += String(d.getMinutes()).padStart(2, "0")

      return str
    }

    const eventInfo = {
      pageBreak: newPage ? "before" : undefined,
      style: "eventTable",
      table: {
        body: [
          // event
          [{ text: event.name, bold: true }],
          [
            {
              text: `Data do evento: ${getDateString(
                "dM",
                event.date_ini as string
              )}`,
            },
          ],
          [{ text: `Início do evento: ${getHours(event.date_ini as string)}` }],
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

    console.log("eventInfo", eventInfo)

    // event
    body.push(eventInfo)

    // ticket

    let tableBody: any[] = [
      [{ text: "Ingresso", bold: true, style: "tableTitle" }],
      [
        {
          text: `Comprado dia ${getDateString("pdf", ticket.date)}`,
          style: "purchaseDate",
        },
      ],
      ...(ticket.user_name
        ? [
            [
              {
                text: `Comprado por ${ticket.user_name}`,
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
            true
          )}`,
        },
      ],
      [
        {
          text: `TAXA: ${formatMoney(ticket.tax_value as number, true)}`,
        },
      ],
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
        text: `TRN: ${ticket.TRN}`,
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
  } catch (error) {
    console.log("Page error", error)
  }

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
