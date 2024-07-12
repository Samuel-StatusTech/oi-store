import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { reportTitle, footer, content } from "./contents"
import { Content, TDocumentDefinitions } from "pdfmake/interfaces"
import { TEventData } from "../@types/data/event"
import { TShoppingTicket } from "../@types/data/ticket"

const downloadTickets = async (
  eventData: TEventData,
  tickets: TShoppingTicket[],
  shouldDownload?: boolean
): Promise<void | File> => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  return new Promise(async (resolve) => {
    try {
      const filename = `Meus Tickets para ${eventData.name.trim()}.pdf`

      let logo = ""

      const docDefs: TDocumentDefinitions = {
        images: {
          logo: {
            url: logo,
          },
        },
        pageSize: "A4",
        pageMargins: [38, 80, 38, 40],
        header:
          eventData.logo && !!logo
            ? ([{ ...reportTitle[0], image: "logo" }] as Content)
            : undefined,
        content: [...content(eventData, tickets)],
        footer: [footer(eventData)] as Content,
        styles: styles,
      }

      const pdf = pdfMake.createPdf(docDefs)

      if (shouldDownload) pdf.download(filename)
      else {
        pdf.getBlob((blob) => {
          const file = new File([blob], filename, { type: "application/pdf" })
          resolve(file)
        })
      }
    } catch (error) {}
  })
}

export default downloadTickets
