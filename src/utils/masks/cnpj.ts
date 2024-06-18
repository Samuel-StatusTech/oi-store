export const formatCNPJ = (v: string) => {
  const nMask = v.replace(/\D/g, "")

  const f = nMask
    .slice(0, 14)
    .replace(
      /(\d{2})(\d{1,3})?(\d{1,3})?(\d{1,4})?(\d{1,2})?/,
      function (_regex, $1, $2, $3, $4, $5) {
        return (
          $1 +
          ($2 ? "." + $2 : "") +
          ($3 ? "." + $3 : "") +
          ($4 ? "/" + $4 : "") +
          ($5 ? "-" + $5 : "")
        )
      }
    )

  return f
}
