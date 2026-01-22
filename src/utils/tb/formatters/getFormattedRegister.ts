import { formatCNPJ } from "../../masks/cnpj"
import { formatCpf } from "../../masks/cpf"

export const getFormattedRegister = (document: string) => {
  return document.length <= 11 ? formatCpf(document) : formatCNPJ(document)
}
