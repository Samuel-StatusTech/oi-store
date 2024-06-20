import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { reportTitle, footer, content } from "./contents"
import { Content, TDocumentDefinitions } from "pdfmake/interfaces"
import { TEventData } from "../@types/data/event"
import { TTicket } from "../@types/data/ticket"

const downloadTickets = async (
  eventData: TEventData,
  tickets: TTicket[],
  shouldDownload?: boolean
): Promise<void | File> => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  return new Promise((resolve) => {
    // Data process

    // File

    const filename = `Meus Tickets para ${eventData.name}.pdf`

    const docDefs: TDocumentDefinitions = {
      pageSize: "A4",
      pageMargins: [38, 80, 38, 40],
      header: [reportTitle] as Content,
      content: [...content(eventData, tickets)],
      footer: [footer(eventData)] as Content,
      styles: styles,
    }

    const pdf = pdfMake.createPdf(docDefs)

    if (shouldDownload) pdf.download(filename)
    else {
      let blob: null | Blob = null
      pdf.getBlob((blobData) => (blob = blobData))

      return resolve(new File([blob as unknown as Blob], filename))
    }
  })
}

export default downloadTickets
