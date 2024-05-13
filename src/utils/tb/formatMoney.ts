export const formatMoney = (amount: number, withDecimals = true) => {
  let v = String(amount).replace(/\D/g, "")

  v = String(+v).padStart(3, "0")

  const decimals = v.slice(v.length - 2)
  const rest = v.slice(0, v.length - 2)

  v = rest.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  if (withDecimals) v += `,${decimals}`

  return `R$ ${v}`
}
