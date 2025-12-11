const ROUNDS = 6
const MOD = 100_000_000 // 10^8

function F(right: number): number {
  // returns random 13 bits
  return (((right * 0x45d9f3b) ^ 0xa5a5a5) >>> 0) & 0x1fff
}

export function generateExternalReferenceFromOrderNumber(orderOid: number) {
  let L = orderOid >>> 14 // 13 bits
  let R = orderOid & 0x3fff // 14 bits

  for (let i = 0; i < ROUNDS; i++) {
    const f = F(R)
    const newL = R
    const newR = (L ^ f) & 0x3fff // 14 bits
    L = newL
    R = newR
  }

  const result = (L << 14) | R
  return result.toString().padStart(8, "0")
}

export function decodeExternalReference(code: string) {
  const x = Number(code)
  if (!Number.isInteger(x) || x < 0 || x >= MOD) {
    throw new Error("Código inválido")
  }

  let L = x >>> 14 // 13 bits
  let R = x & 0x3fff // 14 bits

  for (let i = ROUNDS - 1; i >= 0; i--) {
    const f = F(L) // attention: uses L (because it is the reverse)
    const newR = L
    const newL = (R ^ f) & 0x1fff // 13 bits
    L = newL
    R = newR
  }

  const original = (L << 14) | R

  return original
}
