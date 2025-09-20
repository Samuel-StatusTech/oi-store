import { base64ToFile } from "./base64ToFile"
import { sendEmail } from "./email/sendEmail"
import { getLogoFile } from "./getLogoFile"
import { getPdfFile } from "./getPdfFile"

import { getOrderValue } from "./order/getOrderValue"

const pageToolsPix = {
  base64ToFile,
  getLogoFile,
  getPdfFile,

  email: {
    sendEmail,
  },

  order: {
    getOrderValue,
  },
}

export default pageToolsPix
