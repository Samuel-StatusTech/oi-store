/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react"
import * as S from "./styled"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Container from "../../components/Container"

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
import { useLocation, useNavigate } from "react-router-dom"
import { formatPhone } from "../../utils/masks/phone"
import { getDatePeriod } from "../../utils/tb/getDatePeriod"
import getStore from "../../store"
import { formatCardDate } from "../../utils/masks/date"
import { formatCardCode } from "../../utils/masks/cardcode"
import { Api } from "../../api"
import { sumTaxes } from "../../utils/tb/taxes"
import { validEmail } from "../../utils/tb/validEmail"
import Feedback from "../../components/Feedback"
import { TUser } from "../../utils/@types/data/user"
import ValidateCodeModal from "../../components/Modal/ValidateCode"
import { TEventData } from "../../utils/@types/data/event"
import { isPhoneNumberValid } from "../../utils/tb/phone/isValidPhone"

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
  error?: boolean
  tip?: string
  tipRed?: boolean
  noNumbers?: boolean
  type?: string
  capitalizeWords?: boolean
}

const Input = ({
  label,
  value,
  onChange,
  inputMode,
  enterKeyHint,
  error,
  tip,
  tipRed = false,
  noNumbers = false,
  type = "text",
  capitalizeWords = false,
}: IProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    if (noNumbers) {
      newValue = newValue.replace(/[0-9]/g, "")
    }
    if (capitalizeWords) {
      // Capitaliza a primeira letra de cada palavra após espaços
      newValue = newValue
        .toLowerCase()
        .split(" ")
        .map((word) => {
          if (word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1)
          }
          return word
        })
        .join(" ")
    }
    onChange(newValue)
  }

  return (
    <S.InputWrapper>
      <S.Label>
        <S.Input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={""}
          inputMode={inputMode as any}
          enterKeyHint={enterKeyHint as any}
          $error={error}
        />
        <span>{label}</span>
      </S.Label>
      {tip && (
        <span
          className="inputTip"
          style={{
            marginTop: "4px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: tipRed ? "#f44336" : undefined,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              flexShrink: 0,
            }}
          >
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M8 6V8M8 10H8.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {tip}
        </span>
      )}
    </S.InputWrapper>
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
  const { event, controllers } = store

  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user") as string)
    : null

  const [showingCodeModal, setShowingCodeModal] = useState(false)

  const [method] = useState<"" | "pix" | "credit">("pix")
  const [form, setForm] = useState<TForm>({
    ...initialForm,
    buyer: {
      email: user?.email ?? "",
      name: user?.name ?? "",
      phone: user?.fone ? formatPhone(user?.fone) : "",
    },
  })
  const [flag, setFlag] = useState<TCardFlag>(null)
  const [fieldsOk, setFieldsOk] = useState(false)
  const [canBuy, setCanBuy] = useState(false)

  const [tickets, setTickets] = useState<TTicketDisposal[]>([])
  const [feedback, setFeedback] = useState<any>({ visible: false, message: "" })
  const [formErrors, setFormErrors] = useState<{
    buyerName: boolean
    buyerPhone: boolean
    buyerEmail: boolean
    ticketsIds: number[]
  }>({
    buyerName: false,
    buyerPhone: false,
    buyerEmail: false,
    ticketsIds: [],
  })

  const handleForm = (field: keyof TForm["buyer"], value: string) => {
    if (!user && canBuy) setCanBuy(false)

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
            : t,
        ),
      })
    }
  }

  const handleTicketForm = (
    ticket: TTicketForm,
    field: keyof TTicketForm["person"],
    value: string,
  ) => {
    if (!user && canBuy) setCanBuy(false)

    setForm({
      ...form,
      tickets: form.tickets.map((t: any) =>
        t.id === ticket.id && t.oid === (ticket as any).oid
          ? {
              ...t,
              person: {
                ...t.person,
                [field]: value,
              },
            }
          : t,
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
            (_regex, $1, $2) => $1 + ($2 ? "-" + $2 : ""),
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

  const checkErrors = () => {
    try {
      let hasError = false

      const nameField =
        form.buyer.name.length < 1 ||
        form.buyer.name.trim().split(" ").length < 2

      // Validar se é celular válido (não fixo)
      const cleanedPhone = form.buyer.phone.replace(/\D/g, "")

      // Remove código do país se presente (55)
      let phoneWithoutCountry = cleanedPhone
      if (cleanedPhone.startsWith("55") && cleanedPhone.length === 13) {
        phoneWithoutCountry = cleanedPhone.slice(2)
      }

      const phoneValid = isPhoneNumberValid(form.buyer.phone, true)
      const isCellPhone =
        phoneWithoutCountry.length === 11 &&
        phoneWithoutCountry.length >= 3 &&
        phoneWithoutCountry[2] === "9"

      const phoneField = !phoneValid || !isCellPhone

      const emailField =
        form.buyer.email.length < 1 || !validEmail(form.buyer.email)

      let ticketsIds: number[] = []

      const nominalsErrors =
        event?.nominal &&
        form.tickets.some((t, k) => {
          const status = t.person.name.trim().split(" ").length < 2

          if (status) ticketsIds.push(k)

          return status
        })

      let duplicateNames: number[] = []
      if (event?.nominal && form.tickets.length > 1) {
        const namesMap = new Map<string, number[]>()

        form.tickets.forEach((t, k) => {
          const name = t.person.name.trim().toLowerCase()
          if (name && name.split(" ").length >= 2) {
            if (!namesMap.has(name)) {
              namesMap.set(name, [])
            }
            namesMap.get(name)!.push(k)
          }
        })

        namesMap.forEach((indices) => {
          if (indices.length > 1) {
            duplicateNames.push(...indices)
          }
        })
      }

      if (nameField || emailField || phoneField) hasError = true

      if (nominalsErrors) hasError = true

      if (duplicateNames.length > 0) hasError = true

      return {
        has: hasError,
        fields: {
          name: nameField,
          phone: phoneField,
          email: emailField,
          ticketsIds: ticketsIds,
          duplicateNames: duplicateNames,
        },
      }
    } catch (error) {
      return {
        has: true,
        fields: {
          name: true,
          phone: true,
          email: true,
          ticketsIds: [],
          duplicateNames: [],
        },
      }
    }
  }

  const requestCode = async () => {
    return new Promise(async (resolve) => {
      const dk = store.event?.dk ?? ""

      await Api.post.login
        .requestCode({
          phone: form.buyer.phone.replace(/\D/g, ""),
          avoidSms: true,
          dk: dk,
        })
        .then((res) => {
          resolve(res)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }

  const validateCode = async (code: string) => {
    try {
      const dk = store.event?.dk ?? ""

      const login = await Api.post.login.validateCode({
        phone: form.buyer.phone.replace(/\D/g, ""),
        code,
        email: form.buyer.email.trim(),
        name: form.buyer.name.trim(),
        dk: dk,
      })

      // setShowingCodeModal(false)

      if (login.ok) {
        sessionStorage.setItem("user", JSON.stringify(login.data))
        controllers.user.setData(login.data)

        goToPix()
      } else {
        const f = {
          state: "denied",
          visible: true,
          message: "Código incorreto. Tente novamente.",
        }
        setFeedback(f)

        setTimeout(() => {
          setFeedback({ ...f, visible: false })
        }, 3500)
      }
    } catch (error) {
      const f = {
        state: "denied",
        visible: true,
        message:
          "Houve um erro ao validar seu código. Tente novamente mais tarde",
      }
      setFeedback(f)

      setTimeout(() => {
        setFeedback({ ...f, visible: false })
      }, 3500)
    }
  }

  const getTaxes = () => {
    return sumTaxes({
      adminTax: (event as TEventData).eCommerce.adminTax,
      adminTaxMinimum: +(event as TEventData).eCommerce.adminTaxMinimum,
      adminTaxPercentage: +(event as TEventData).eCommerce.adminTaxPercentage,
      adminTaxValue: +(event as TEventData).eCommerce.adminTaxValue,
      tickets: tickets,
    })
  }

  const getTicketsList = (finalTaxValue: number) => {
    let ptickets: any[] = []

    const itemsQnt = tickets
      .map((t) => t.qnt)
      .reduce((prev, current) => prev + current, 0)

    const taxPerTicket = finalTaxValue / itemsQnt

    form.tickets.forEach((tt) => {
      const t = tickets.find((t) => t.id === tt.id) as TTicketDisposal

      ptickets.push({
        price_sell: t.price_sell,
        batch_id: t.batch_id,
        customer_name: tt?.person.name,
        id: t.id,
        tax_value: taxPerTicket,
        ticketName: t.name,
        batchName: t.batch_name,
        ticket_name: tt?.person.name,
        quantity: 1,
      })
    })

    return ptickets
  }

  // Payment

  const goToPix = () => {
    const taxes = getTaxes()

    let ptickets = getTicketsList(taxes.value)

    localStorage.removeItem("payed")
    localStorage.removeItem("paymentSession")

    navigate("/payment/pix", {
      state: {
        tickets: ptickets,
        disposalTickets: tickets,
        buyer: form.buyer,
        taxTotal: taxes.value,
        isNewOrder: true,
      },
    })
  }

  const handlePay = async () => {
    const errors = checkErrors()

    if (!errors.has && event) {
      const taxes = getTaxes()

      if (method === "pix")
        if (user) {
          const ptickets = getTicketsList(taxes.value)

          const stateParams = {
            tickets: ptickets,
            disposalTickets: tickets,
            buyer: form.buyer,
            taxTotal: +taxes.value,
            isNewOrder: true,
          }

          localStorage.removeItem("payed")
          localStorage.removeItem("paymentSession")

          navigate("/payment/pix", {
            state: stateParams,
          })
        } else {
          const getToken = (await requestCode()) as any

          if (getToken.ok) {
            // show modal

            if (getToken.ok) {
              const code = getToken.data.code

              validateCode(code)
              return
            } else {
              const f = {
                state: "denied",
                visible: true,
                message:
                  "Houve um erro ao validar seu código. Tente novamente mais tarde",
              }
              setFeedback(f)

              setTimeout(() => {
                setFeedback({ ...f, visible: false })
              }, 3500)
            }
          } else {
            const newUser = await Api.post.register(form.buyer)

            if (newUser.ok && newUser.data.success) {
              const udata: TUser = {
                ...newUser.data.token.user,
                email: newUser.data.data.email,
                token: newUser.data.token.token,
                user_id: newUser.data.data.id,
              }

              sessionStorage.setItem("user", JSON.stringify(udata))
              controllers.user.setData(udata)

              goToPix()
            } else {
              if (!newUser.ok) {
                const f = {
                  state: "denied",
                  visible: true,
                  message: newUser.error,
                }
                setFeedback(f)

                setTimeout(() => {
                  setFeedback({ ...f, visible: false })
                }, 3500)
              } else {
                const f = {
                  state: "denied",
                  visible: true,
                  message:
                    // @ts-ignore
                    newUser.error ??
                    "Houve um erro ao lhe cadastrar. Tente novamente mais tarde.",
                }
                setFeedback(f)

                setTimeout(() => {
                  setFeedback({ ...f, visible: false })
                }, 3500)
              }

              // navigate(-1)
              return
            }
          }
        }
      else if (method === "credit") return
    } else {
      let fieldsErrors = []
      let fieldsStr = ""

      let newErrorValue = { ...formErrors }

      if (errors.fields.name) {
        fieldsErrors.push("Nome")
        newErrorValue.buyerName = true
      }
      if (errors.fields.phone) {
        fieldsErrors.push("Celular válido")
        newErrorValue.buyerPhone = true
      }
      if (errors.fields.email) {
        fieldsErrors.push("E-mail")
        newErrorValue.buyerEmail = true
      }
      // Inicializa o array de ticketsIds com erros de validação de nome/sobrenome
      if (errors.fields.ticketsIds.length > 0) {
        fieldsErrors.push("Nome e sobrenome")
        newErrorValue.ticketsIds = errors.fields.ticketsIds
      } else {
        newErrorValue.ticketsIds = []
      }

      // Adiciona erros de nomes duplicados, mesclando e removendo duplicatas
      if (
        errors.fields.duplicateNames &&
        errors.fields.duplicateNames.length > 0
      ) {
        fieldsErrors.push("Nomes duplicados nos participantes")
        newErrorValue.ticketsIds = Array.from(
          new Set([
            ...newErrorValue.ticketsIds,
            ...errors.fields.duplicateNames,
          ]),
        )
      }

      setFormErrors(newErrorValue)

      // Formata os erros com bullets para melhor visualização
      const formattedErrors = fieldsErrors
        .map((error) => `• ${error}`)
        .join("\n")
      fieldsStr = formattedErrors

      const f = {
        state: "expired",
        visible: true,
        message: `Preencha os campos corretamente:\n${fieldsStr}`,
      }
      setFeedback(f)

      setTimeout(() => {
        setFeedback({ ...f, visible: false })

        setTimeout(() => {
          setCanBuy(true)
        }, 400)
      }, 3500)
    }
  }

  const clearFieldError = (field: string, ticketId?: number) => {
    if (
      field !== "ticketsIds" &&
      formErrors[field as keyof typeof formErrors]
    ) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: false,
      }))
    } else if (
      field === "ticketsIds" &&
      ticketId !== undefined &&
      ticketId > -1
    ) {
      setFormErrors((prev) => ({
        ...prev,
        ticketsIds: prev.ticketsIds.filter((i) => i !== ticketId),
      }))
    }
  }

  const loadEventData = useCallback(async () => {
    if (event) {
      try {
        const req = await Api.get.eventInfo({ eventId: event?.id })

        if (req.ok) {
          const data = req.data
          sessionStorage.setItem("event", JSON.stringify(data))
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
    if (!user) setCanBuy(false)

    if (lctn.state) {
      const pickedTickets = lctn.state.tickets ?? null

      if (pickedTickets) {
        setTickets(pickedTickets)
      } else navigate("/")
    } else navigate("/")
  }, [lctn.state, navigate])

  useEffect(() => {
    if (event?.nominal) {
      let ticketsUsersOk = form.tickets.every((t) => !!t.person.name.trim())

      setFieldsOk(!checkErrors().has && ticketsUsersOk)
    } else {
      setFieldsOk(!checkErrors().has)
    }
  }, [form.buyer, form.tickets])

  useEffect(() => {
    loadEventData()
  }, [loadEventData])

  return (
    <S.Page>
      <ValidateCodeModal
        shown={showingCodeModal}
        handleClose={() => setShowingCodeModal(false)}
        handleValidate={validateCode}
      />

      <Feedback data={feedback} />

      <Header />

      <Container>
        <S.Main>
          <S.EventResume>
            <S.PaymentData>
              <span>Pagamento</span>
              <img src={methodsInfos.pix.img} alt={""} />
            </S.PaymentData>

            <S.Form>
              <S.FormBlock $k={1}>
                <span>Informações do(a) comprador(a)</span>

                <S.FormLines>
                  <S.FormLine>
                    <Input
                      label={"Nome e sobrenome"}
                      value={form.buyer.name}
                      onChange={(v: string) => {
                        handleForm("name", v)
                        clearFieldError("buyerName")
                      }}
                      error={formErrors.buyerName}
                      noNumbers={true}
                      capitalizeWords={true}
                    />
                  </S.FormLine>
                  <S.FormLine>
                    <Input
                      label={"Telefone"}
                      value={form.buyer.phone}
                      onChange={(v: string) => {
                        handleForm("phone", v)
                        clearFieldError("buyerPhone")
                      }}
                      inputMode="numeric"
                      error={formErrors.buyerPhone}
                      tip={"Necessário para receber os ingressos"}
                      tipRed={true}
                    />
                    <Input
                      label={"Email"}
                      value={form.buyer.email}
                      onChange={(v: string) => {
                        handleForm("email", v)
                        clearFieldError("buyerEmail")
                      }}
                      type="email"
                      enterKeyHint={"done"}
                      error={formErrors.buyerEmail}
                      tip={"Opcional"}
                    />
                  </S.FormLine>
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

                      {k === 0 && (
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
                                ),
                              )
                            }}
                          />
                          <span>Utilizar dados do(a) comprador(a)</span>
                        </S.Checkbox>
                      )}

                      <S.FormLines>
                        <S.FormLine>
                          <Input
                            label={"Nome e sobrenome"}
                            value={ticket.person.name}
                            onChange={(v: string) => {
                              handleTicketForm(ticket, "name", v)
                              clearFieldError("ticketsIds", k)
                            }}
                            error={formErrors.ticketsIds.includes(k)}
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

              <S.Button $disabled={!fieldsOk} onClick={handlePay}>
                PAGAR
              </S.Button>
            </S.Form>
          </S.EventResume>

          <OrderResume
            datePeriod={getDatePeriod(
              event?.date_ini as string,
              event?.date_end as string,
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
