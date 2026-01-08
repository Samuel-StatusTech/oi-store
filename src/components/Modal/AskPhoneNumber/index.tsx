import { useEffect, useState } from "react"
import * as S from "./styled"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { Input } from "../../../pages/Login/styled"
import { formatPhone } from "../../../utils/masks/phone"

type Props = {
  shown: boolean
  basePhone: string
  handleConfirm: (code: string) => Promise<void>
  handleClose: () => void
}

const AskPhoneNumberModal = ({
  shown,
  basePhone,
  handleConfirm,
  handleClose,
}: Props) => {
  const [phone, setPhone] = useState(formatPhone(basePhone))
  const [canSend, setCanSend] = useState(true)

  const onConfirm = async () => {
    let finalPhone = phone
    await handleConfirm(finalPhone)
    setPhone("")
  }

  useEffect(() => {
    setPhone(formatPhone(basePhone))
  }, [shown, basePhone])

  useEffect(() => {
    setCanSend(phone.replace(/\D/g, "").length === 11)
  }, [phone])

  return (
    <Dialog open={shown} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Enviar para o Whatsapp</DialogTitle>
      <DialogContent>
        <Input
          inputMode={"numeric"}
          value={phone}
          onChange={({ target }) =>
            setPhone(formatPhone(target.value).slice(0, 13))
          }
        />
      </DialogContent>
      <DialogActions
        style={{
          padding: "8px 24px 24px",
        }}
      >
        <S.Button
          $disabled={!canSend}
          onClick={!canSend ? undefined : onConfirm}
        >
          Enviar
        </S.Button>
      </DialogActions>
    </Dialog>
  )
}

export default AskPhoneNumberModal
