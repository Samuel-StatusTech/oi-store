import * as S from "./styled"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { formatMoney } from "../../utils/tb/formatMoney"
import { useNavigate } from "react-router-dom"
import getStore from "../../store"
import { TForm } from "../../utils/placeData/form"
import { memo, useCallback, useEffect, useState } from "react"
import { eventHasTaxes, sumTaxes } from "../../utils/tb/taxes"
import TicketsGroup from "../TicketsGroup"
import Ticket from "../Ticket"

type Props = {
  showByGroup: boolean
  groups: { id: string; name: string }[]
  tickets: TTicketDisposal[]
  setTickets: (list: TTicketDisposal[]) => void
}

const TicketsControl = ({
  showByGroup,
  tickets,
  setTickets,
  groups,
}: Props) => {
  const navigate = useNavigate()

  const { event, user } = getStore()

  const [taxes, setTaxes] = useState({
    value: 0,
    rule: "",
    strComplement: "",
  })
  const [ticketsTotal, setTicketsTotal] = useState(0)
  const [total, setTotal] = useState(0)

  const calcTotal = useCallback(() => {
    let val = tickets.reduce((qnt, tk) => qnt + tk.price_sell * tk.qnt, 0)

    return val
  }, [tickets])

  const calcTotals = useCallback(() => {
    if (event) {
      const tTotal = calcTotal()

      const tax = sumTaxes({
        chargeClient: event.eCommerce.chargeClient,
        adminTax: event?.eCommerce.adminTax,
        adminTaxMinimum: +event?.eCommerce.adminTaxMinimum,
        adminTaxPercentage: +event?.eCommerce.adminTaxPercentage,
        adminTaxValue: +event?.eCommerce.adminTaxValue,
        tickets: tickets,
      })

      setTaxes(tax)
      setTicketsTotal(tTotal)
      setTotal(tTotal > 0 ? tTotal + tax.value : 0)
    }
  }, [calcTotal, event, tickets])

  const changeQnt = (
    ticketId: number | string,
    action: "decrease" | "increase"
  ) => {
    let nList = [...tickets]

    const tk = nList.find((t) => t.id === ticketId) as TTicketDisposal

    if (action === "decrease") {
      if (tk.qnt > 0) {
        nList = nList.map((tkt) =>
          tkt.id !== tk.id
            ? tkt
            : {
                ...tkt,
                qnt: tk.qnt - 1,
              }
        )
      }
    } else if (action === "increase") {
      if (tk.qnt + 1 <= tk.quantity && tk.qnt + 1 <= 20) {
        nList = nList.map((tkt) =>
          tkt.id !== tk.id
            ? tkt
            : {
                ...tkt,
                qnt: tk.qnt + 1,
              }
        )
      }
    }

    setTickets(nList)

    calcTotals()
  }

  const checkErrors = () => {
    let hasError = false

    if (user && event) {
      if (user.name.length < 1 || user.fone.replace(/\D/g, "").length < 9)
        hasError = true
    }

    return hasError
  }

  const handleBuy = () => {
    // @ts-ignore
    if (user && !event?.nominal) {
      const errors = checkErrors()

      const itemsQnt = tickets
        .map((t) => t.qnt)
        .reduce((prev, current) => prev + current, 0)

      const taxPerTicket = taxes.value / itemsQnt

      if (!errors) {
        let ptickets: any[] = []
        tickets.forEach((t) => {
          for (let k = 0; k <= t.qnt - 1; k++) {
            ptickets.push({
              price_sell: t.price_sell,
              batch_id: t.batch_id,
              id: t.id,
              tax_value: taxPerTicket,
              ticketName: t.name,
              ticket_name: "",
              quantity: 1,
            })
          }
        })

        const buyer: TForm["buyer"] = {
          name: user.name,
          phone: user.fone,
          email: user.email,
        }

        const stateParams = { tickets: ptickets, buyer, taxTotal: +taxes.value }

        localStorage.removeItem("payed")

        setTimeout(() => {
          navigate("/payment/pix", {
            state: stateParams,
          })
        }, 200)
      } else {
        alert("Preencha os campos corretamente e tente novamente.")
      }
    } else {
      navigate("/payment", {
        state: { tickets },
      })
      window.scrollTo({ top: 0 })
    }
  }

  useEffect(() => {
    calcTotals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets])

  return (
    <S.Component>
      <S.Top>
        <span>Ingressos</span>
      </S.Top>
      <S.Tickets>
        {Boolean(event?.keep_sells_online) ? (
          showByGroup ? (
            groups.map((g, gKey) => (
              <TicketsGroup
                group_name={g.name}
                key={gKey}
                k={6}
                data={tickets.filter((i) => i.group_id === g.id)}
                changeQnt={changeQnt}
              />
            ))
          ) : (
            tickets.map((t, k) => (
              <Ticket k={k} key={k} ticket={t} changeQnt={changeQnt} />
            ))
          )
        ) : (
          <S.KeepOutSellsOnlineMessage>
            {event?.keep_out_sells_online_message ?? "Vendas online suspensas."}
          </S.KeepOutSellsOnlineMessage>
        )}
      </S.Tickets>
      {Boolean(event?.keep_sells_online) && tickets.length > 0 ? (
        <S.Bottom>
          <S.TaxesResume>
            <S.TaxResume>
              <span>Subtotal</span>
              <span>{formatMoney(ticketsTotal, true)}</span>
            </S.TaxResume>
            {event?.eCommerce.chargeClient && eventHasTaxes(event) && (
              <S.TaxResume>
                <span>Taxas {taxes.strComplement}</span>
                <span>
                  {formatMoney(ticketsTotal > 0 ? taxes.value : 0, true)}
                </span>
              </S.TaxResume>
            )}
          </S.TaxesResume>
          <S.BottomFinal>
            <S.Resume>
              <S.Total>{`Total ${formatMoney(total, true)}`}</S.Total>
            </S.Resume>
            <S.BuyBtn
              onClick={
                tickets.every((t) => t.qnt === 0) ? undefined : handleBuy
              }
              disabled={tickets.every((t) => t.qnt === 0)}
            >
              Comprar
            </S.BuyBtn>
          </S.BottomFinal>
        </S.Bottom>
      ) : (
        <S.KeepOutSellsOnlineMessage>
          Sem ingressos ativos no momento.
        </S.KeepOutSellsOnlineMessage>
      )}
    </S.Component>
  )
}

export default memo(TicketsControl)
