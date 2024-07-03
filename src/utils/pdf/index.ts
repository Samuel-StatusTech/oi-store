import axios from "axios"

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

  return new Promise(async (resolve) => {
    // Data process

    // File

    const filename = `Meus Tickets para ${eventData.name}.pdf`

    let logo = ""

    try {
      if (eventData.logo) {
        const response = await axios.get(eventData.logo, {
          responseType: "blob",
        })

        const blob = new Blob([response.data], { type: response.data.type })
        const logoUrl = URL.createObjectURL(blob)
        if (logoUrl) logo = logoUrl
      }

      console.log(logo)
    } catch (error) {}

    const docDefs: TDocumentDefinitions = {
      // images: !!eventData.logo ? { logo: { url: eventData.logo } } : undefined,
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
      let blob: null | Blob = null
      pdf.getBlob((blobData) => (blob = blobData))

      return resolve(new File([blob as unknown as Blob], filename))
    }
  })
}

export default downloadTickets
