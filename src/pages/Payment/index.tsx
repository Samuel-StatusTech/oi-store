/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react"
import * as S from "./styled"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"
import BlockInfo from "../../components/BlockInfo"

import calendar from "../../assets/icons/calendar.png"
import location from "../../assets/icons/pin.png"

import pixImage from "../../assets/icons/payment/ic-pix.png"
import cardVisa from "../../assets/icons/payment/ic-visa.png"
import cardMaster from "../../assets/icons/payment/ic-master.png"
import cardAmex from "../../assets/icons/payment/ic-amex.png"
import cardDiners from "../../assets/icons/payment/ic-diners.png"
import cardElo from "../../assets/icons/payment/ic-elo.png"
import cardDiscover from "../../assets/icons/payment/ic-discover.png"
import OrderResume from "../../components/OrderResume"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { TForm, TTicketForm, initialForm } from "../../utils/placeData/form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { formatCpf } from "../../utils/masks/cpf"
import { formatPhone } from "../../utils/masks/phone"
import { getDatePeriod, getHours } from "../../utils/tb/getDatePeriod"
import getStore from "../../store"
import { formatCardDate } from "../../utils/masks/date"
import { formatCardCode } from "../../utils/masks/cardcode"
import { Api } from "../../api"
import { sumTaxes, sumTickets } from "../../utils/tb/taxes"

type MProps = {
  checked: boolean
  type: "pix" | "credit"
  onSelect: (method: "pix" | "credit") => void
}

const methodsInfos = {
  pix: {
    title: "Mais rápido e seguro",
    targeted: true,
    img: pixImage,
  },
  credit: {
    title: "Cartão de crédito",
    targeted: false,
    list: [
      {
        link: "",
        icon: cardVisa,
      },
      {
        link: "",
        icon: cardMaster,
      },
      {
        link: "",
        icon: cardAmex,
      },
      {
        link: "",
        icon: cardDiners,
      },
      {
        link: "",
        icon: cardElo,
      },
      {
        link: "",
        icon: cardDiscover,
      },
    ],
  },
}

type IProps = {
  label: string
  value: string
  onChange: (v: string) => void
  inputMode?: string
  enterKeyHint?: string
}

const Input = ({ label, value, onChange, inputMode, enterKeyHint }: IProps) => {
  return (
    <S.Label>
      <S.Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={""}
        inputMode={inputMode as any}
        enterKeyHint={enterKeyHint as any}
      />
      <span>{label}</span>
    </S.Label>
  )
}

const Method = ({ checked, type, onSelect }: MProps) => {
  return (
    <S.Method $checked={checked} onClick={() => onSelect(type)}>
      <S.MTitle>{methodsInfos[type].title}</S.MTitle>

      {type === "pix" ? (
        <img src={methodsInfos[type].img} alt={""} />
      ) : (
        <S.List>
          {methodsInfos[type].list.map((c, k) => (
            <S.CardItem href={c.link} key={k}>
              <img src={c.icon} alt={""} width={48} />
            </S.CardItem>
          ))}
        </S.List>
      )}

      <S.Recommended $visible={methodsInfos[type].targeted}>
        Recomendado
      </S.Recommended>
    </S.Method>
  )
}

type TCardFlag =
  | null
  | "VISA"
  | "MASTERCARD"
  | "AMERICAN EXPRESS"
  | "DISCOVER"
  | "DINERSCLUB"
  | "ELO"

const Payment = () => {
  const lctn = useLocation()
  const navigate = useNavigate()

  const store = getStore()
  const { user, event, controllers } = store

  const [termsAgreed, setTermsAgreed] = useState(false)

  const [method, setMethod] = useState<"" | "pix" | "credit">("pix")
  const [form, setForm] = useState<TForm>({
    ...initialForm,
    buyer: {
      cpf: "",
      name: user?.name ?? "",
      phone: user?.fone ? formatPhone(user?.fone) : "",
    },
  })
  const [flag, setFlag] = useState<TCardFlag>(null)
  const [fieldsOk, setFieldsOk] = useState(false)

  const [tickets, setTickets] = useState<TTicketDisposal[]>([])

  const handleSelect = (newMethod: "pix" | "credit") => {
    if (method === newMethod) setMethod("")
    else setMethod(newMethod)
  }

  const handleForm = (field: keyof TForm["buyer"], value: string) => {
    if (field === "cpf") value = formatCpf(value)
    if (field === "phone") value = formatPhone(value)

    setForm({
      ...form,
      buyer: {
        ...form.buyer,
        [field]: value,
      },
    })
  }

  const usePayer = (ticket: TTicketForm, should: boolean) => {
    if (should) {
      setForm({
        ...form,
        tickets: form.tickets.map((t) =>
          // @ts-ignore
          t.id === ticket.id && t.oid === ticket.oid
            ? {
                ...t,
                person: {
                  name: form.buyer.name,
                  phone: form.buyer.phone,
                },
              }
            : t
        ),
      })
    }
  }

  const handleTicketForm = (
    ticket: TTicketForm,
    field: keyof TTicketForm["person"],
    value: string
  ) => {
    setForm({
      ...form,
      tickets: form.tickets.map((t) =>
        t.id !== ticket.id
          ? t
          : {
              ...t,
              person: {
                ...t.person,
                [field]: value,
              },
            }
      ),
    })
  }

  const checkFlag = (cNumber: string): TCardFlag => {
    const cardNumber = cNumber.replace(/\D/g, "")

    var visaRegEx = /^4[0-9]{12}(?:[0-9]{3})?$/
    var mastercardRegEx = /^5[1-5][0-9]{14}$/
    var americanExpressRegEx = /^3[47][0-9]{13}$/
    var discoverRegEx = /^6(?:011|5[0-9]{2})[0-9]{12}$/
    var dinersClubRegEx = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/
    var eloRegEx =
      /^(40117[89]|4(?:011|44[0-9]{2}|5[0-9]{2}|[89][0-9]{2})\d{10}|627780|63\d{10}|6504\d{12}|6507\d{12}|6550\d{12})$/

    if (visaRegEx.test(cardNumber)) {
      return "VISA"
    } else if (mastercardRegEx.test(cardNumber)) {
      return "MASTERCARD"
    } else if (americanExpressRegEx.test(cardNumber)) {
      return "AMERICAN EXPRESS"
    } else if (discoverRegEx.test(cardNumber)) {
      return "DISCOVER"
    } else if (dinersClubRegEx.test(cardNumber)) {
      return "DINERSCLUB"
    } else if (eloRegEx.test(cardNumber)) {
      return "ELO"
    } else {
      return null
    }
  }

  const formatCep = (v: string) => {
    const nMask = v.replace(/\D/g, "").slice(0, 8)

    const f =
      nMask.length > 0
        ? nMask.replace(
            /(\d{1,5})?(\d{1,2})?/,
            (_regex, $1, $2) => $1 + ($2 ? "-" + $2 : "")
          )
        : ""

    return f
  }

  const handleCard = (field: keyof TForm["card"], value: string) => {
    let v = value

    if (field === "number") {
      v = v
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .slice(0, 19)

      var checkedFlag = checkFlag(v)

      if (!!checkedFlag) setFlag(checkedFlag)
      else setFlag(null)
    }

    if (field === "date") v = formatCardDate(v)
    if (field === "code") v = formatCardCode(v)
    if (field === "address") v = formatCep(v)

    setForm({
      ...form,
      card: {
        ...form.card,
        [field]: v,
      },
    })
  }

  const renderFlag = () => {
    if (flag) {
      let url = ""

      switch (flag) {
        case "AMERICAN EXPRESS":
          url = cardAmex
          break
        case "DINERSCLUB":
          url = cardDiners
          break
        case "DISCOVER":
          url = cardDiscover
          break
        case "ELO":
          url = cardElo
          break
        case "MASTERCARD":
          url = cardMaster
          break
        case "VISA":
          url = cardVisa
          break
        default:
          break
      }

      return (
        <img
          src={url}
          alt={""}
          style={{
            height: 32,
            width: "auto",
            alignSelf: "flex-start",
          }}
        />
      )
    }
  }

  const getIniHour = () => {
    let str = event?.date_ini
      ? getHours(
          new Date(
            event?.date_ini.slice(0, event?.date_ini.indexOf("T")) +
              "T" +
              event?.time_ini +
              ".000Z"
          )
        )
      : event?.time_ini
      ? event.time_ini.slice(0, 5)
      : "Dia todo"

    return str
  }

  const checkErrors = () => {
    let hasError = false

    if (
      form.buyer.name.length < 1 ||
      form.buyer.phone.replace(/\D/g, "").length < 9
    )
      hasError = true

    if (event?.nominal && form.tickets.some((t) => t.person.name.length < 1))
      hasError = true

    return hasError
  }

  const handlePay = () => {
    const errors = checkErrors()

    if (!errors) {
      const taxes = sumTaxes({
        ticketsTotal: sumTickets(tickets),
        adminTax: event?.eCommerce.adminTax,
        adminTaxMinimum: event?.eCommerce.adminTaxMinimum,
        adminTaxPercentage: event?.eCommerce.adminTaxPercentage,
        adminTaxValue: event?.eCommerce.adminTaxValue,
      })

      if (method === "pix")
        navigate("/payment/pix", {
          state: { tickets: form.tickets, buyer: form.buyer, taxTotal: taxes },
        })
      else if (method === "credit") return
    } else {
      alert("Preencha os campos corretamente e tente novamente.")
    }
  }

  const loadEventData = useCallback(async () => {
    if (event) {
      try {
        const req = await Api.get.eventInfo({ eventId: event?.id })

        if (req.ok) {
          const data = req.data
          controllers.event.setData(data)
        }
      } catch (error) {
        alert("Erro ao carregar os tickets")
      }
    } else navigate("/eventSelect")
  }, [])

  useEffect(() => {
    let ticketsList: any[] = []

    tickets.forEach((t) => {
      for (let k = 0; k <= t.qnt - 1; k++) {
        ticketsList.push({ ...t, oid: k, person: { name: "" } })
      }
    })

    setForm({
      ...form,
      tickets: ticketsList,
    })

    // eslint-disable-next-line
  }, [tickets])

  useEffect(() => {
    if (lctn.state) {
      const pickedTickets = lctn.state.tickets ?? null

      if (pickedTickets) {
        setTickets(pickedTickets)
      } else navigate("/")
    } else navigate("/")
  }, [lctn.state, navigate])

  useEffect(() => {
    setFieldsOk(!!form.buyer.name && !!form.buyer.phone)
    loadEventData()
  }, [loadEventData, form.buyer])

  return (
    <S.Page>
      <Header />

      <Container>
        <S.Main>
          <S.EventResume>
            <S.EventData>
              <S.EventName>{event?.name}</S.EventName>
              <BlockInfo
                k={3}
                small={true}
                icon={<img src={calendar} alt={""} width={40} />}
                description={[
                  getDatePeriod(
                    event?.date_ini as string,
                    event?.date_end as string
                  ),
                  getIniHour(),
                ]}
              />
              <BlockInfo
                k={4}
                small={true}
                icon={<img src={location} alt={""} width={40} />}
                description={[
                  `${event?.address}`,
                  `${event?.city} - ${event?.uf}`,
                ]}
              />
            </S.EventData>

            <S.PaymentData>
              <span>Pagamento</span>
              <S.Methods>
                <Method
                  checked={method === "pix"}
                  type={"pix"}
                  onSelect={handleSelect}
                />
              </S.Methods>
            </S.PaymentData>

            {method && (
              <S.Form>
                <S.FormBlock $k={1}>
                  <span>Informações do(a) comprador(a)</span>

                  <S.FormLines>
                    <S.FormLine>
                      <Input
                        label={"Nome e sobrenome"}
                        value={form.buyer.name}
                        onChange={(v: string) => handleForm("name", v)}
                      />
                      <Input
                        label={"Telefone"}
                        value={form.buyer.phone}
                        onChange={(v: string) => handleForm("phone", v)}
                        inputMode="numeric"
                        enterKeyHint={"done"}
                      />
                    </S.FormLine>
                    {method === "credit" && (
                      <S.FormLine>
                        <Input
                          label={"CPF"}
                          value={form.buyer.cpf}
                          onChange={(v: string) => handleForm("cpf", v)}
                        />
                      </S.FormLine>
                    )}
                  </S.FormLines>
                </S.FormBlock>

                {Boolean(event?.nominal) && (
                  <S.FormBlock $k={2}>
                    <span>Informações dos participantes</span>

                    {form.tickets.map((ticket, k) => (
                      <S.TicketBlock key={k}>
                        <S.TicketName>
                          <span>Ingresso {k + 1}: </span>
                          <span>{ticket.name}</span>
                        </S.TicketName>

                        <S.Checkbox htmlFor={`check-${k}`}>
                          <input
                            id={`check-${k}`}
                            type="checkbox"
                            checked={
                              !!ticket.person.name &&
                              ticket.person.name === form.buyer.name
                            }
                            onClick={() => {
                              // eslint-disable-next-line react-hooks/rules-of-hooks
                              usePayer(
                                ticket,
                                !(
                                  !!ticket.person.name &&
                                  ticket.person.name === form.buyer.name
                                )
                              )
                            }}
                          />
                          <span>Utilizar dados do(a) comprador(a)</span>
                        </S.Checkbox>

                        <S.FormLines>
                          <S.FormLine>
                            <Input
                              label={"Nome e sobrenome"}
                              value={ticket.person.name}
                              onChange={(v: string) =>
                                handleTicketForm(ticket, "name", v)
                              }
                            />
                          </S.FormLine>
                        </S.FormLines>
                      </S.TicketBlock>
                    ))}
                  </S.FormBlock>
                )}

                {method === "credit" && (
                  <S.FormBlock $k={3}>
                    <span>Informações do pagamento</span>

                    {renderFlag()}

                    <S.FormLines>
                      <S.FormLine>
                        <Input
                          label={"Número do cartão"}
                          value={form.card.number}
                          onChange={(v: string) => handleCard("number", v)}
                        />
                        <Input
                          label={"Data de validade"}
                          value={form.card.date}
                          onChange={(v: string) => handleCard("date", v)}
                        />
                        <Input
                          label={"Código de serguraça"}
                          value={form.card.code}
                          onChange={(v: string) => handleCard("code", v)}
                        />
                      </S.FormLine>
                    </S.FormLines>

                    <S.FormLines>
                      <S.FormLine>
                        <Input
                          label={"Nome impresso no cartão"}
                          value={form.card.name}
                          onChange={(v: string) => handleCard("name", v)}
                        />
                      </S.FormLine>
                    </S.FormLines>
                  </S.FormBlock>
                )}

                {method === "credit" && (
                  <S.FormBlock $k={4}>
                    <span>Endereço de faturamento</span>

                    <S.FormLines>
                      <S.FormLine>
                        <Input
                          label={"CEP"}
                          value={form.card.address}
                          onChange={(v: string) => handleCard("address", v)}
                        />
                      </S.FormLine>
                    </S.FormLines>
                  </S.FormBlock>
                )}

                {/* Terms */}

                <S.Checkbox htmlFor={`check-terms`}>
                  <input
                    id={`check-terms`}
                    type="checkbox"
                    onChange={(value) => setTermsAgreed(value.target.checked)}
                  />
                  <div className={"terms"}>
                    <span>Concordo com os </span>
                    <Link to={""}> Termos de Serviço</Link>
                    <span>as Diretrizes e a </span>
                    <Link to={""}>Política de Privacidade</Link>
                    <span>de {event?.corporateName}.</span>
                  </div>
                </S.Checkbox>

                <S.Button
                  $disabled={termsAgreed === false || !fieldsOk}
                  onClick={termsAgreed ? handlePay : undefined}
                >
                  PAGAR
                </S.Button>
              </S.Form>
            )}
          </S.EventResume>

          <OrderResume
            datePeriod={getDatePeriod(
              event?.date_ini as string,
              event?.date_end as string
            )}
            ticketsList={tickets.filter((t) => t.qnt > 0)}
            setTickets={setTickets}
          />
        </S.Main>
      </Container>

      <Footer />
    </S.Page>
  )
}

export default Payment
