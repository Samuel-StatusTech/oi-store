import { QRCodeSVG } from "qrcode.react"
import { TTicket } from "../../utils/@types/ticket"
import * as S from "./styled"
import { statusRelations } from "../../utils/placeData/statusRelations"

type Props = {
  data: TTicket
  handleExpand: (ticket: TTicket) => void
}

const EventTicketItem = ({ data, handleExpand }: Props) => {
  const renderStatus = () => {
    let str = statusRelations[data.status] ?? ""
    return str
  }

  return (
    <S.Component onClick={() => handleExpand(data)}>
      <S.TicketTitle>{data.title}</S.TicketTitle>
      <QRCodeSVG value={data.code} />
      <S.TicketStatus $status={data.status}>{renderStatus()}</S.TicketStatus>
    </S.Component>
  )
}

export default EventTicketItem
