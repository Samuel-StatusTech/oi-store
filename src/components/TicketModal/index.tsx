import { QRCodeSVG } from "qrcode.react"
import { TTicket } from "../../utils/@types/data/ticket"
import * as S from "./styled"
import { statusRelations } from "../../utils/placeData/statusRelations"
import { useEffect, useRef } from "react"

type Props = {
  shown: boolean
  data: TTicket | null
  handleClose: () => void
}

const TicketModal = ({ shown, data, handleClose }: Props) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const renderStatus = () => {
    let str = data?.status ? statusRelations[data?.status] : ""
    return str
  }

  const animateModal = (visible: boolean) => {
    if (wrapperRef.current) {
      if (visible) {
        document.body.style.overflow = "hidden";
        wrapperRef.current.classList.add("visible")
        wrapperRef.current.classList.add("shown")
      } else {
        document.body.style.overflow = "unset";
        wrapperRef.current.classList.remove("shown")

        setTimeout(() => {
          if (wrapperRef.current) wrapperRef.current.classList.remove("visible")
        }, 650)
      }
    }
  }

  const close = () => {
    animateModal(false)

    setTimeout(() => {
      handleClose()
    }, 700)
  }

  useEffect(() => {
    if (shown) animateModal(shown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, wrapperRef.current])

  return (
    <S.Wrapper onClick={close} ref={wrapperRef}>
      <S.Component>
        <S.TicketTitle>{data?.name ?? ""}</S.TicketTitle>
        <QRCodeSVG value={data?.code ?? ""} />
        <S.TicketStatus $status={data?.status ?? undefined}>
          {renderStatus()}
        </S.TicketStatus>
      </S.Component>
    </S.Wrapper>
  )
}

export default TicketModal
