import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { reportTitle, footer, content } from "./contents"
import { Content, TDocumentDefinitions } from "pdfmake/interfaces"
import { TEventData } from "../@types/data/event"
import { TTicket } from "../@types/data/ticket"

const downloadTickets = async (eventData: TEventData, tickets: TTicket[]) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  return new Promise((resolve) => {
    // Data process

    // File

    const filename = "Nome legal"

    const docDefs: TDocumentDefinitions = {
      pageSize: "A4",
      pageMargins: [38, 80, 38, 40],
      header: [reportTitle] as Content,
      content: [...content(eventData, tickets)],
      footer: [footer(eventData)] as Content,
      styles: styles,
    }

    const pdf = pdfMake.createPdf(docDefs)

    // if (mustDownload)
    pdf.download(`Relatório financeiro ${"event.name"} ${filename}.pdf`)
    // else pdf.getBlob((blob) => resolve(blob))
  })
}

export default downloadTickets
