import { TEventData } from "../../../@types/data/event"
import { base64ToFile } from "./base64ToFile"

export const getLogoFile = async (
  event: TEventData
): Promise<File | string> => {
  let res: string | File = ""

  const logo = event?.logoWebstore ?? event?.logoWebstoreUrl

  res = logo ? base64ToFile(logo, "logo.png") : ""

  return res
}
