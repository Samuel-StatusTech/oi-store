import * as S from "./styled"

type Props = {
  data: {
    state: "PAID" | "CANCELED" | "EXPIRED" | "DECLINED"
    visible: boolean
    message: string
  }
}

const Feedback = ({ data }: Props) => {
  return (
    <S.Box
      $color={
        data.state === "PAID"
          ? "green"
          : data.state === "EXPIRED"
          ? "orange"
          : "red"
      }
      $visible={data.visible}
    >
      <span>{data.message}</span>
    </S.Box>
  )
}

export default Feedback
