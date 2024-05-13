import Header from "../components/Header"
import * as S from "./styled"

import Container from "../components/Container"
import BlockInfo from "../components/BlockInfo"

import example from "../../assets/images/exemplo.png"
import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"
import TicketsControl from "../components/TicketsControl"
import Footer from "../components/Footer"
import Organizer from "../components/Organizer"

const Home = () => {
  return (
    <S.Page>
      <Header />
      <S.Hero>
        <img src={example} alt={""} className={"blured"} />
        <Container>
          <img src={example} alt={""} />
        </Container>
      </S.Hero>

      <Container>
        <S.EventDataArea>
          <S.MainData>
            <S.EventName>Evento Teste</S.EventName>
            <S.Blocks>
              <BlockInfo
                title="Data e Hora"
                description={["De 11 a 14 de dezembro de 2022", "17:00"]}
                icon={<img src={calendar} alt={""} />}
              />
              <BlockInfo
                title="Localização"
                description={[
                  "Rua Aubé, nº 895",
                  "Centro, Joinville - SC",
                  "89205-00",
                ]}
                icon={<img src={location} alt={""} />}
              />
            </S.Blocks>
          </S.MainData>

          <TicketsControl />
        </S.EventDataArea>
      </Container>

      <S.DescriptionWrapper>
        <Container>
          <S.DescriptionSection>
            <S.DescTitle>Descrição</S.DescTitle>
            <S.DescTexts>
              <S.DescText>
                {`Parango Beach acontece dia 3 de dezembro e traz Parangolé e Xandy Harmonia juntos, na Pipa Beach Club
A vibe do verão vai invadir, mais uma vez, a barraca Pipa - tradicional clube de praia localizado na Praia do Flamengo.
E dessa vez a Pipa levará o pagode do Parangolé, liderado por Tony Salles e o inconfundível som de Xandy Harmonia para animar a galera.
Depois de levar nomes como Léo Santana, Timbalada e Thiago Aquino para a beira da praia, a Pipa aposta agora em duas atrações de peso para embalar ainda mais o clima de verão que o clube de praia tem.
Com um repertório repleto de maiores sucessos de suas carreiras, Tony e Xandy não escondem a alegria de estarem juntos, em mais um projeto.
E para quem curte o som do Parango e de Xandy, a oportunidade de curtir dois super shows é essa! Ad vendas iniciam hoje, às 12h no site do Sympla e no site da Bora Tickets, ou na loja do Bora, localizada no 2° piso do Shopping da Bahia.
Não fique de fora e venha curtir a vibe que só a Pipa tem! Animação, música boa e astral único!`}
              </S.DescText>
            </S.DescTexts>
          </S.DescriptionSection>
          <S.DescriptionSection>
            <S.DescTitle>Local</S.DescTitle>
            <S.DescText>{`Centro de Eventos X`}</S.DescText>
            <S.DescText $bold={true}>Endereço</S.DescText>
            <S.DescSubText>{`Rua Aubé, 895 - Brusque, Joinville - SC,`}</S.DescSubText>
            <S.DescSubText>{`89205-000`}</S.DescSubText>
            <S.DescText $bold={true}>Telefone</S.DescText>
            <S.DescSubText>{`(47) 3207-3009`}</S.DescSubText>
          </S.DescriptionSection>
        </Container>
      </S.DescriptionWrapper>

      <Container>
        <S.Organizers>
          <Organizer
            icon={
              "https://static.vecteezy.com/system/resources/previews/012/871/371/original/google-search-icon-google-product-illustration-free-png.png"
            }
            name={"GR Produções, Shows e Eventos!"}
            phone={"(38) 99221-6176"}
            description={[
              "GR Produções, Shows e Eventos!",
              "Eventos com qualidade e segurança!",
            ]}
          />
        </S.Organizers>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default Home
