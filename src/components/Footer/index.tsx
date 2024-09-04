import * as S from "./styled"

import getStore from "../../store"
import { formatCNPJ } from "../../utils/masks/cnpj"

const Footer = () => {
  const { event } = getStore()

  return (
    <S.Component>
      <S.CopyArea>
        <S.CopyItem>
          Ingressos vendidos sob responsabilidade de {event?.corporateName} -
        </S.CopyItem>
        <S.CopyItem>CNPJ/CPF {formatCNPJ(event?.CNPJ ?? "")}</S.CopyItem>
      </S.CopyArea>
    </S.Component>
  )
}

export default Footer
