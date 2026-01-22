import * as S from "./styled"

import getStore from "../../store"
import { TOrganizer } from "../../utils/@types/data/organizer"
import { getFormattedRegister } from "../../utils/tb/formatters/getFormattedRegister"

type Props = {
  customData?: TOrganizer
}

const Footer = ({ customData }: Props) => {
  const { event } = getStore()

  const getRegister = () => {
    const document = (event ?? customData)?.CNPJ ?? ""
    return getFormattedRegister(document)
  }

  return (
    <S.Component>
      <S.CopyArea>
        <S.CopyItem>
          Ingressos vendidos sob responsabilidade de{" "}
          {(event ?? customData)?.corporateName} - CNPJ/CPF {getRegister()}
        </S.CopyItem>
      </S.CopyArea>
    </S.Component>
  )
}

export default Footer
