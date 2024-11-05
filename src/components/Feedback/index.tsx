import * as S from "./styled"

type Props = {
  data: {
    state: "approved" | "denied" | "expired"
    visible: boolean
    message: string
  }
}

const Feedback = ({ data }: Props) => {
  return (
    <S.Wrapper $visible={data.visible}>
      <S.Box
        $color={
          data.state === "approved"
            ? "green"
            : data.state === "expired"
            ? "orange"
            : "red"
        }
        $visible={data.visible}
      >
        <span>{data.message}</span>
      </S.Box>
    </S.Wrapper>
  )
}

export default Feedback
