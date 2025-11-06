const FINAL_VALIDATION_REGEX =
  /^(?:\+?55\s?)?\(?([1-9]{2})\)?\s?(?:9\s?)?(\d{4})[-\s]?(\d{4})$/

const DIGITING_VALIDATION_REGEX =
  /^(?:(?:\+?55\s?)?\s?\(?([1-9]{2})?\)?\s?)?(?:((?:9\s?)?\d{0,4})[-\s]?)(\d{0,4})$/

export function cleanPhoneNumber(phone: string) {
  if (!phone) return ""
  return phone.replace(/[^\d]/g, "")
}

export function isPhoneNumberValid(phone: string, isFinalValidation = true) {
  if (!phone) return false

  const regex = isFinalValidation
    ? FINAL_VALIDATION_REGEX
    : DIGITING_VALIDATION_REGEX

  const cleanedPhoneNumber = cleanPhoneNumber(phone)

  return regex.test(cleanedPhoneNumber)
}
