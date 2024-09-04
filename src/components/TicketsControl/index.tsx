import * as S from "./styled"
import Ticket from "../Ticket"
import { TTicketDisposal } from "../../utils/@types/data/ticket"
import { formatMoney } from "../../utils/tb/formatMoney"
import { useNavigate } from "react-router-dom"
import getStore from "../../store"
import { TForm } from "../../utils/placeData/form"
import { useEffect, useState } from "react"
import { sumTaxes } from "../../utils/tb/taxes"

type Props = {
  tickets: TTicketDisposal[]
  setTickets: (list: TTicketDisposal[]) => void
}

const TicketsControl = ({ tickets, setTickets }: Props) => {
  const navigate = useNavigate()

  const { event, user } = getStore()

  const [taxes, setTaxes] = useState(0)
  const [ticketsTotal, setTicketsTotal] = useState(0)
  const [total, setTotal] = useState(0)

  const calcTotal = () => {
    let val = tickets.reduce((qnt, tk) => qnt + tk.price_sell * tk.qnt, 0)

    return val
  }

  const calcTotals = () => {
    const tTotal = calcTotal()

    const tax = sumTaxes({
      ticketsTotal: tTotal,
      adminTax: event?.eCommerce.adminTax,
      adminTaxMinimum: event?.eCommerce.adminTaxMinimum,
      adminTaxPercentage: event?.eCommerce.adminTaxPercentage,
      adminTaxValue: event?.eCommerce.adminTaxValue,
    })

    setTaxes(tax)
    setTicketsTotal(tTotal)
    setTotal(tTotal > 0 ? tTotal + tax : 0)
  }

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
      if (tk.qnt + 1 <= tk.quantity) {
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
    console.log(event)
    // @ts-ignore
    if (user && !event?.nominal) {
      const errors = checkErrors()

      if (!errors) {
        let ptickets: any[] = []

        tickets.forEach((t) => {
          for (let k = 0; k <= t.qnt - 1; k++) {
            ptickets.push({ ...t, oid: k, person: { name: "" } })
          }
        })

        const buyer: TForm["buyer"] = {
          name: user.name,
          phone: user.fone,
          email: user.email,
        }

        navigate("/payment/pix", {
          state: { tickets: ptickets, buyer, taxTotal: taxes },
        })
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

  const renderTaxResume = () => {
    let str = ""

    if (event) {
      const minValue = +event.eCommerce.adminTaxMinimum ?? 0

      str =
        taxes > minValue
          ? `(${+event.eCommerce.adminTaxPercentage / 100}%)`
          : "min"
    }

    return str
  }

  return (
    <S.Component>
      <S.Top>
        <span>Ingressos</span>
      </S.Top>
      <S.Tickets>
        {tickets.map((t, k) => (
          <Ticket k={k} key={k} ticket={t} changeQnt={changeQnt} />
        ))}
      </S.Tickets>
      <S.Bottom>
        {user && (
          <S.TaxesResume>
            <S.TaxResume>
              <span>Subtotal</span>
              <span>{formatMoney(ticketsTotal, true)}</span>
            </S.TaxResume>
            <S.TaxResume>
              <span>Taxas {renderTaxResume()}</span>
              <span>{formatMoney(ticketsTotal > 0 ? taxes : 0, true)}</span>
            </S.TaxResume>
          </S.TaxesResume>
        )}
        <S.BottomFinal>
          <S.Resume>
            <S.Total>{`Total ${formatMoney(
              user ? total : ticketsTotal,
              true
            )}`}</S.Total>
          </S.Resume>
          <S.BuyBtn
            onClick={tickets.every((t) => t.qnt === 0) ? undefined : handleBuy}
            disabled={tickets.every((t) => t.qnt === 0)}
          >
            Comprar
          </S.BuyBtn>
        </S.BottomFinal>
      </S.Bottom>
    </S.Component>
  )
}

export default TicketsControl
