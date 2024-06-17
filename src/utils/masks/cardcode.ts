export const formatCardCode = (v: string) => {
  const nMask = v.replace(/\D/g, "").slice(0, 4)

  const f = nMask

  return f
}
