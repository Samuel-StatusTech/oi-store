export const formatCardDate = (v: string) => {
  const nMask = v.replace(/\D/g, "").slice(0, 4)

  const f =
    nMask.length > 0
      ? nMask.replace(
          /(\d{1,2})?(\d{1,2})?/,
          (_regex, $1, $2) => (+$1 > 12 ? 12 : +$1) + ($2 ? "/" + $2 : "")
        )
      : ""

  return f
}
