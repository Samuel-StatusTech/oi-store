export const formatCep = (v: string) => {
  const nMask = v.replace(/\D/g, "").slice(0, 8)

  const f =
    nMask.length > 0
      ? nMask.replace(
          /(\d{1,5})?(\d{1,2})?/,
          (_regex, $1, $2) => $1 + ($2 ? "-" + $2 : "")
        )
      : ""

  return f
}
