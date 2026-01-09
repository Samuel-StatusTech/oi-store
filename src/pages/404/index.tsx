import { Ticket, MessageCircle, MapPinOff, ArrowLeft } from "lucide-react"

import * as S from "./styled"

export default function NotFound() {
  const whatsappNumber = "5547991211530"
  const whatsappMessage =
    "Olá! Sou produtor de eventos e caí na página de erro. Gostaria de saber como cadastrar minha empresa na Lista PIX."
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`

  const handleGoBack = () => {
    window.location.href = "/"
  }

  return (
    <S.Container>
      <S.Navbar>
        <S.Logo onClick={handleGoBack}>
          <S.LogoIcon>
            <Ticket size={24} color="#fff" />
          </S.LogoIcon>
          <S.LogoText>Lista PIX</S.LogoText>
        </S.Logo>
      </S.Navbar>

      <S.Main>
        <S.Content>
          <S.Illustration>
            <S.Code404>404</S.Code404>

            <S.IconWrapper>
              <MapPinOff size={48} />
            </S.IconWrapper>
          </S.Illustration>

          <S.TextBlock>
            <h1>Link não encontrado</h1>
            <p>
              Você pode ter digitado o endereço errado, mas acabou encontrando o
              lugar certo para o sucesso do seu negócio.
            </p>
          </S.TextBlock>

          <S.Card>
            <h3>Sua empresa ainda está fora?</h3>
            <p>
              Não deixe seus eventos invisíveis. Junte-se à plataforma que
              simplifica a gestão e multiplica suas vendas via PIX.
            </p>

            <S.WhatsappButton
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={22} />
              Cadastrar Minha Empresa
            </S.WhatsappButton>
          </S.Card>

          <S.BackButton onClick={handleGoBack}>
            <ArrowLeft size={18} />
            Voltar para a página inicial
          </S.BackButton>
        </S.Content>
      </S.Main>

      <S.Footer>
        &copy; {new Date().getFullYear()} Lista PIX. Todos os direitos
        reservados.
      </S.Footer>
    </S.Container>
  )
}
