import * as S from "./styled"

import getStore from "../../store"
import { formatCNPJ } from "../../utils/masks/cnpj"
import { TOrganizer } from "../../utils/@types/data/organizer"

type Props = {
  customData?: TOrganizer
}

const Footer = ({ customData }: Props) => {
  const { event } = getStore()

  return (
    <S.Component>
      <S.CopyArea>
        <S.CopyItem>
          Ingressos vendidos sob responsabilidade de{" "}
          {(event ?? customData)?.corporateName} -
        </S.CopyItem>
        <S.CopyItem>
          CNPJ/CPF {formatCNPJ((event ?? customData)?.CNPJ ?? "")}
        </S.CopyItem>
      </S.CopyArea>
    </S.Component>
  )
}

export default Footer
