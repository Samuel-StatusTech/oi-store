import { TEventData } from "../../../@types/data/event"
import downloadTickets from "../../../pdf"

export const getPdfFile = async (
  event: TEventData,
  productsList: any[]
): Promise<File> => {
  const file = (await downloadTickets(
    event as TEventData,
    productsList,
    false
  )) as File

  return file
}
