import { TEventData } from "../../../@types/data/event"
import { base64ToFile } from "./base64ToFile"

export const getLogoFile = async (
  event: TEventData
): Promise<File | string> => {
  let res: string | File = ""

  res = event?.logoWebstore ? base64ToFile(event?.logoWebstore, "logo.png") : ""

  return res
}
