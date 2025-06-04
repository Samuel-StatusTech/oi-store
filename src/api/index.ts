import axios from "axios"
import { TApi } from "../utils/@types/api"
import { TProduct } from "../utils/@types/data/product"
import { jwtDecode } from "jwt-decode"
import TParams from "../utils/@types/api/params"
import { formatDate } from "date-fns"

axios.defaults.baseURL = "https://api.oitickets.com.br/api/v1"

const backUrl = process.env.REACT_APP_BACKEND_URL
const mailingUrl = process.env.REACT_APP_EMAIL_BACKEND_URL

const checkTokenExpiration = (token: string) => {
  try {
    const decoded = jwtDecode(token)

    const iat = (decoded.iat as number) * 1000
    const now = +new Date().getTime().toFixed(0)

    const limit = 50 * 60 * 1000
    const exp = iat + limit

    return now > exp
  } catch (error) {
    return true
  }
}

axios.interceptors.request.use(function (config) {
  try {
    const localToken = sessionStorage.getItem("token")

    if (localToken) {
      if (localToken === "undefined") {
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("token")

        window.location.reload()
      } else {
        const isTokenExpired = checkTokenExpiration(localToken)

        if (isTokenExpired) {
          sessionStorage.removeItem("user")
          sessionStorage.removeItem("token")

          window.location.reload()
        } else config.headers.Authorization = `Bearer ${localToken}`
      }
    }

    return config
  } catch (error) {
    return config
  }
})

/*
 * Getters
 */

const getQrCode: TApi["get"]["qrcode"] = async ({ order }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parsed: TParams["get"]["qrcode"]["order"] = {
        ...order,
        transaction_amount: order.transaction_amount / 100,
      }

      await axios
        .post(`${backUrl}/ecommerce/payment/orders/qrcode`, parsed)
        .then((res) => {
          const info = res.data

          if (info) {
            resolve({
              ok: true,
              data: info.data,
            })
          } else {
            reject({
              error: "Erro ao processar o qrcode. Tente novamente mais tarde",
            })
          }
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Erro ao carregar o qrcode. Tente novamente mais tarde",
          })
        })
    } catch (error) {
      reject({
        error: "Erro ao carregar o qrcode. Tente novamente mais tarde",
      })
    }
  })
}

const getEvents: TApi["get"]["events"] = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .get(`ecommerce/getInfo`)
        .then(async (res) => {
          const list = res.data.events

          if (list) {
            resolve({
              ok: true,
              data: list
                .filter((ev: any) => Boolean(ev.is_ecommerce))
                .map((ev: any) => ({
                  ...ev,
                  dk: res.data.dk,
                })),
            })
          } else {
            reject({
              error: "Erro ao carregar os eventos. Tente novamente mais tarde",
            })
          }
        })
        .catch((err) => {
          resolve({
            ok: false,
            error: "Erro ao carregar os eventos. Tente novamente mais tarde",
          })
        })
      // }
    } catch (error) {
      reject({
        error: "Erro ao carregar os eventos. Tente novamente mais tarde",
      })
    }
  })
}

const getEventInfo: TApi["get"]["eventInfo"] = async ({ eventId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const req = await axios.get(`/ecommerce/getInfo?eventId=${eventId}`, {
        headers: {
          "X-event-id": eventId,
        },
      })

      const events = req.data.events ?? null

      if (events) {
        const event = events.find((e: any) => e.id === eventId)

        if (event) {
          const eventData = {
            ...req.data.info,
            ...event,
            dk: req.data.dk,
          }

          resolve({
            ok: true,
            data: eventData,
          })
        } else {
          resolve({
            ok: false,
            error:
              "Erro ao carregar as informações do evento. Tente novamente mais tarde",
          })
        }
      } else throw new Error()
    } catch (error) {
      resolve({
        ok: false,
        error:
          "Erro ao carregar as informações do evento. Tente novamente mais tarde",
      })
    }
  })
}

const getProducts: TApi["get"]["products"] = async ({ eventId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .get(`/ecommerce/product/getList?eventId=${eventId}`, {
          data: JSON.stringify({ userKey: "fjLZQ8D29PfCwI2SbKwPgB7r7gD3" }),
        })
        .then((res) => {
          const receivedList = res.data

          const list = Array.isArray(receivedList) ? receivedList : []

          let parsed: TProduct[] = []
          list.forEach((i) => {
            const activeBatchData = i.batches.find((b: any) =>
              Boolean(b.active)
            )

            const isTicketActive =
              i.active || i.batches.some((b: any) => Boolean(b.active))

            if (activeBatchData) {
              const obj = {
                id: i.product_id,
                name: i.name,
                image: i.image,
                created_at: i.created_at,
                updated_at: i.updated_at,
                active: isTicketActive,
                batch_id: activeBatchData.batch_id,
                group_id: i.group_id ?? "",
                group_name: i.group_name ?? "",
                quantity: activeBatchData.quantity,
                price_sell: activeBatchData.price_sell,
              }

              parsed.push(obj)
            }
          })

          resolve({
            ok: true,
            data: { list: parsed },
          })
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Erro ao listar produtos. Tente novamente mais tarde",
          })
        })
    } catch (error) {
      reject({
        error: "Erro ao listar produtos. Tente novamente mais tarde",
      })
    }
  })
}

const getMyTickets: TApi["get"]["myTickets"] = async ({
  eventId,
  eventName,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .get(`/ecommerce/getMyTickets?eventId=${eventId}`)
        .then(async ({ data }) => {
          let returnList: any[] = []

          const list = Array.isArray(data.shoppings) ? data.shoppings : []

          let pms: Promise<any>[] = []

          const ordersIds = new Set(
            list
              .filter((shop: any) => shop.event_name === eventName)
              .map((shop: any) => shop.order_id)
          )

          ordersIds.forEach((id) => {
            pms.push(
              axios
                .get(`/${eventId}/ecommerce/orders/${id}`)
                .then((res) => {
                  const purchase = res.data
                  returnList.push(purchase)
                })
                .catch(() => {
                  // throw new Error()
                })
            )
          })

          await Promise.all(pms)

          const fuse = new Date().getTimezoneOffset() / 60

          const parsedList = returnList.map((item) => {
            const d = new Date(item.products[0].date)
            d.setHours(d.getHours() - fuse)
            const dString = d.toString()

            const pList = item.products.map((p: any) => {
              const pd = new Date(p.date)
              pd.setHours(pd.getHours() - fuse)
              const pdString = pd.toString()

              const nDate = formatDate(pdString, "yyyy-MM-dd HH:mm:ss")

              return { ...p, date: nDate }
            })

            return {
              ...item,
              date: dString,
              quantity: item.products.length,
              products: pList,
              total_price: item.products.reduce(
                (amount: number, ticket: any) => amount + ticket.price_total,
                0
              ),
            }
          })

          resolve({
            ok: true,
            data: { list: parsedList },
          })
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Erro ao listar produtos. Tente novamente mais tarde",
          })
        })
    } catch (error) {
      reject({
        error: "Erro ao listar produtos. Tente novamente mais tarde",
      })
    }
  })
}

/*
 * Login
 */

const registerUser: TApi["post"]["register"] = async ({
  phone,
  name,
  email,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post("/ecommerce/register", {
          name,
          fone: phone.replace(/\D/g, "").trim(),
          email,
        })
        .then((res) => {
          // store token ...

          if (res.data.token.token) {
            sessionStorage.setItem("token", res.data.token.token)

            resolve({ ok: true, data: res.data })
          } else {
            resolve({
              ok: false,
              error:
                typeof res.data.error === "string"
                  ? res.data.error
                  : "Houver um erro na hora do cadastro. Tente novamente mais tarde.",
            })
          }
        })
        .catch((error) => {
          resolve({
            ok: false,
            error:
              error.response.data.error ??
              "Algo deu errado. Tente novamente mais tarde.",
          })
        })
    } catch (error) {
      // @ts-ignore
      // const errorMessage = error.response.data.error
      reject({
        ok: false,
        error: "Erro ao cadastrar usuário. Tente novamente mais tarde",
      })
    }
  })
}

const requestCode: TApi["post"]["login"]["requestCode"] = async ({
  phone,
  avoidSms,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post("/ecommerce/requestCode", {
          fone: phone,
          database: "DB4b9313e3cee08d9ac3d144e18870bc0db20813cd",
        })
        .then(async (res) => {
          if (res.data.success) {
            const code = res.data.code

            const body = { phone: phone, code }

            if (code) {
              if (avoidSms) resolve({ ok: true, data: { code, success: true } })
              else {
                await axios
                  .post("/api/sendcode", body, {
                    baseURL: mailingUrl,
                  })
                  .then((res) => {
                    const status = res.data.sended

                    if (Boolean(status))
                      resolve({
                        ok: true,
                        data: {
                          code,
                          message: "Código enviado com sucesso.",
                          success: true,
                        },
                      })
                    else throw new Error()
                  })
                  .catch(() => {
                    resolve({
                      ok: false,
                      error:
                        "Houve um erro ao enviar o código para seu telefone. Tente novamente mais tarde.",
                    })
                  })
              }
            } else
              resolve({
                ok: false,
                error:
                  "Houve um erro ao soliciar o código. Tente novamente mais tarde.",
              })
          } else
            resolve({
              ok: false,
              error: "Algo deu errado. Tente novamente mais tarde.",
            })
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Algo deu errado. Tente novamente mais tarde.",
          })
        })
    } catch (error) {
      reject({ error: "Erro ao requisitar código. Tente novamente mais tarde" })
    }
  })
}

const validateCode: TApi["post"]["login"]["validateCode"] = async ({
  phone,
  code,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post("/ecommerce/authenticate", {
          fone: phone,
          code: code,
          database: "DB4b9313e3cee08d9ac3d144e18870bc0db20813cd",
        })
        .then((res) => {
          const uObj = {
            ...res.data.user,
            cpf: res.data.roleData.cpf,
            fone: res.data.roleData.fone,
          }

          sessionStorage.setItem("token", res.data.token)

          resolve({ ok: true, data: uObj })
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Algo deu errado. Tente novamente mais tarde.",
          })
        })
    } catch (error) {
      reject({ error: "Erro ao requisitar código. Tente novamente mais tarde" })
    }
  })
}

/*
 * Mailing
 */

const sendEmail: TApi["post"]["mail"]["sendEmail"] = async (mailInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData()

      formData.append("file", mailInfo.file)
      formData.append("logoWebstoreUrl", mailInfo.logoWebstoreUrl)
      formData.append("logo", mailInfo.logo)

      formData.append("eventName", mailInfo.eventName)
      formData.append("eventDate", mailInfo.eventDate)
      formData.append("eventTime", mailInfo.eventTime)
      formData.append("eventLocal", mailInfo.eventLocal)

      formData.append("purchaseCode", mailInfo.purchaseCode)
      formData.append("purchaseTime", mailInfo.purchaseTime)
      formData.append("purchaseValue", mailInfo.purchaseValue)
      formData.append("purchaseItems", mailInfo.purchaseItems)
      formData.append("purchaseStatus", mailInfo.purchaseStatus)

      formData.append("targetEmail", mailInfo.targetEmail)

      await axios
        .post("/api/sendemail", formData, {
          baseURL: mailingUrl,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const status = res.data.sended

          if (Boolean(status)) resolve({ ok: true, data: { sended: status } })
          else throw new Error()
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Algo deu errado. Tente novamente mais tarde.",
          })
        })
    } catch (error) {
      reject({ error: "Erro ao enviar email. Tente novamente mais tarde" })
    }
  })
}

/*
 * Purchase
 */

const signPurchase: TApi["post"]["purchase"]["sign"] = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post("/ecommerce/buyTicket", data)
        .then((res) => {
          const purchase = res.data

          resolve({ ok: true, data: purchase })
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Algo deu errado. Tente novamente mais tarde.",
          })
        })
    } catch (error) {
      reject({ error: "Erro ao solicitar tickets. Tente novamente mais tarde" })
    }
  })
}

const mpGenerate: TApi["post"]["purchase"]["mpGenerate"] = async ({
  body,
  iKey,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post("https://api.mercadopago.com/v1/payments", body, {
          headers: {
            "X-Idempotency-Key": iKey,
          },
          baseURL: "",
        })
        .then((res) => {
          const purchase = res.data

          resolve({ ok: true, data: purchase })
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Algo deu errado. Tente novamente mais tarde.",
          })
        })
    } catch (error) {
      reject({ error: "Erro ao solicitar tickets. Tente novamente mais tarde" })
    }
  })
}

const confirmPurchase: TApi["post"]["purchase"]["confirm"] = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post("/ecommerce/confirmBuyTicket", data)
        .then((res) => {
          const purchase = res.data

          resolve({ ok: true, data: purchase })
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Algo deu errado. Tente novamente mais tarde.",
          })
        })
    } catch (error) {
      reject({ error: "Erro ao solicitar tickets. Tente novamente mais tarde" })
    }
  })
}

const getPurchase: TApi["get"]["purchaseInfo"] = async ({
  eventId,
  orderId,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .get(`/${eventId}/ecommerce/orders/${orderId}`)
        .then((res) => {
          const purchase = res.data

          const productsList = purchase.products.map((t: any) => {
            const fuse = new Date().getTimezoneOffset() / 60

            const d = new Date(t.date)
            d.setHours(d.getHours() - fuse)
            const dString = d.toString()

            return {
              ...t,
              date: dString,
            }
          })

          const info = {
            ...purchase,
            products: productsList,
          }

          resolve({ ok: true, data: info })
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Algo deu errado. Tente novamente mais tarde.",
          })
        })
    } catch (error) {
      reject({ error: "Erro ao solicitar tickets. Tente novamente mais tarde" })
    }
  })
}

export const Api: TApi = {
  get: {
    qrcode: getQrCode,
    events: getEvents,
    eventInfo: getEventInfo,
    myTickets: getMyTickets,
    products: getProducts,
    purchaseInfo: getPurchase,
  },
  post: {
    register: registerUser,
    login: {
      requestCode: requestCode,
      validateCode: validateCode,
    },
    purchase: {
      sign: signPurchase,
      mpGenerate: mpGenerate,
      confirm: confirmPurchase,
    },
    mail: {
      sendEmail,
    },
  },
}
