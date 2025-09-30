export const formatPhone = (phone: string) => {
  let str = ""

  str = phone.replace(/(\d{2})(\d{4,5})(\d{4})/g, "($1) $2-$3") ?? ""

  return str
}
