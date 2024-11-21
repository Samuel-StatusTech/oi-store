import { useState } from "react"
import * as S from "./styled"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { Input } from "../../../pages/Login/styled"

type Props = {
  shown: boolean
  handleValidate: (code: string) => void
  handleClose: () => void
}

const ValidateCodeModal = ({ shown, handleValidate, handleClose }: Props) => {
  const [code, setCode] = useState("")

  const onValidate = () => {
    setCode("")
    handleValidate(code)
  }

  return (
    <Dialog open={shown} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Valide seu código</DialogTitle>
      <DialogContent>
        <Input
          value={code}
          onChange={({ target }) =>
            setCode(target.value.replace(/\D/g, "").slice(0, 6))
          }
        />
      </DialogContent>
      <DialogActions
        style={{
          padding: "8px 24px 24px",
        }}
      >
        <S.Button
          $disabled={code.length !== 6}
          onClick={code.length !== 6 ? undefined : onValidate}
        >
          Validar
        </S.Button>
      </DialogActions>
    </Dialog>
  )
}

export default ValidateCodeModal
