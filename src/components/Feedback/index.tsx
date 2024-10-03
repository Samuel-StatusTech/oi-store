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
        <span>
          {
            "Você não está logado. Caso tenha uma conta, faça login primeiro. Caso contrário, confira os dados e confirme para se cadastrar e comprar."
          }
        </span>
      </S.Box>
    </S.Wrapper>
  )
}

export default Feedback
