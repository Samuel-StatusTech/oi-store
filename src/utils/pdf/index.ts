import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { footer, content } from "./contents"
import { Content, TDocumentDefinitions } from "pdfmake/interfaces"
import { TEventData } from "../@types/data/event"
import { TShoppingTicket } from "../@types/data/ticket"
import { generateTicketID } from "../tb/qrcode"

const downloadTickets = async (
  eventData: TEventData,
  tickets: TShoppingTicket[],
  shouldDownload?: boolean,
  returnBase64?: boolean
): Promise<void | File | string> => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  return new Promise(async (resolve) => {
    try {
      const tkts = tickets.map((t) => {
        const tid = generateTicketID(
          false,
          "ecommerce",
          t.opuid,
          eventData.oid as number,
          eventData.dbName
        )

        return { ...t, qr_TID: tid }
      })

      // ---

      const filename = `Meus Ingressos para ${eventData.name.trim()}.pdf`

      let logo = eventData.logoWebstore
        ? await resizeImageToFit(eventData.logoWebstore)
        : null // await getBase64EventLogo(eventData)

      const logoHeight = logo ? (logo.height ? 80 : undefined) : 0

      const docDefs: TDocumentDefinitions = {
        images: {
          logo: {
            url: eventData.logoWebstore,
          },
        },
        pageSize: "A4",
        pageMargins: [38, logoHeight ? logoHeight + 48 : 80, 38, 40],
        header:
          logo && !!eventData.logoWebstore
            ? ([
                {
                  image: "logo",
                  width: logo.width,
                  absolutePosition: { x: 38, y: 38 },
                },
                // {
                //   margin: 38,
                //   columns: [
                //     {
                //       table: {
                //         widths: [logo.width, "*"],
                //         body: [
                //           [
                //             {
                //               image: "logo",
                //               // absolutePosition: { x: 38, y: 38 },
                //             },
                //             { text: "" },
                //           ],
                //         ],
                //       },
                //       // layout: "noBorders",
                //     },
                //   ],
                // },
              ] as Content)
            : undefined,
        content: [...content(eventData, tkts as any)],
        footer: [footer(eventData)] as Content,
        styles: styles,
      }

      const pdf = pdfMake.createPdf(docDefs)

      if (shouldDownload) pdf.download(filename)
      else {
        if (returnBase64) {
          pdf.getBase64((res) => {
            resolve(res)
          })
        } else {
          pdf.getBlob((blob) => {
            const file = new File([blob], filename, { type: "application/pdf" })
            resolve(file)
          })
        }
      }
    } catch (error) {}
  })
}

const resizeImageToFit = (
  base64: string,
  maxWidth = 140,
  maxHeight = 80
): Promise<{
  base64: string
  width: number
  height: number
}> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
      const newWidth = img.width * ratio
      const newHeight = img.height * ratio

      const canvas = document.createElement("canvas")
      canvas.width = newWidth
      canvas.height = newHeight

      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0, newWidth, newHeight)

      const resizedBase64 = canvas.toDataURL("image/png")
      resolve({
        base64: resizedBase64,
        width: newWidth,
        height: newHeight,
      })
    }

    img.onerror = (err) => reject("Erro ao carregar a imagem")
  })
}

export default downloadTickets
