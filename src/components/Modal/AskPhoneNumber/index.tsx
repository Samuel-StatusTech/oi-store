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
  handleConfirm: (code: string) => void
  handleClose: () => void
}

const AskPhoneNumberModal = ({
  shown,
  basePhone,
  handleConfirm,
  handleClose,
}: Props) => {
  const [code, setCode] = useState(formatPhone(basePhone))
  const [canSend, setCanSend] = useState(true)

  const onConfirm = () => {
    setCode("")
    handleConfirm(code)
  }

  useEffect(() => {
    console.log(code.replace(/\D/g, ""))
    setCanSend(code.replace(/\D/g, "").length === 11)
  }, [code])

  return (
    <Dialog open={shown} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Enviar para o Whatsapp</DialogTitle>
      <DialogContent>
        <Input
          value={code}
          onChange={({ target }) =>
            setCode(formatPhone(target.value).slice(0, 13))
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
          Confirmar
        </S.Button>
      </DialogActions>
    </Dialog>
  )
}

export default AskPhoneNumberModal
