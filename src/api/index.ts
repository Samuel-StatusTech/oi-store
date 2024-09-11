import axios from "axios"
import { TApi } from "../utils/@types/api"

axios.defaults.baseURL = "https://api.oitickets.com.br/api/v1"

const backUrl = "https://api.oitickets.com.br/api/v1"

const dToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZqTFpROEQyOVBmQ3dJMlNiS3dQZ0I3cjdnRDMiLCJkYXRhYmFzZSI6IkRCNGI5MzEzZTNjZWUwOGQ5YWMzZDE0NGUxODg3MGJjMGRiMjA4MTNjZCIsImNsaWVudEtleSI6Ii1OYWxaenZiMndhc1VfNmR1R2NuIiwiaWF0IjoxNzE3NDk1MzQzLCJleHAiOjE5NzQxMDMzNDN9.50knxx6WtR8TBD0byCCPo7Qaxe6SV6MXvHujZYYd4rI`

try {
  axios.interceptors.request.use(function (config) {
    // config.headers.Authorization = (!config.url?.includes("event/getSelect") && !config.url?.includes("event/getData"))
    //   ? localStorage.getItem("token") ?? dToken
    //   : dToken

    config.headers.Authorization = dToken

    return config
  })
} catch (error) {}

/*
 * Getters
 */

const getQrCode: TApi["get"]["qrcode"] = async ({ order }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post(`${backUrl}/ecommerce/payment/orders/qrcode`, order)
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
        .get(`event/getSelect?status=ativo`)
        .then(async (res) => {
          const info = res.data.events

          let eventsWithImages: any[] = []
          let promises: Promise<any>[] = []

          info.forEach(async (ev: any) => {
            promises.push(
              getEventInfo({ eventId: ev.id }).then((res) => {
                if (res.ok) {
                  eventsWithImages.push({
                    ...ev,
                    logo: res.data.event_banner ?? ev.logo,
                  })
                }
              })
            )
          })

          await Promise.all(promises)

          if (info) {
            resolve({
              ok: true,
              data: eventsWithImages,
            })
          } else {
            reject({
              error: "Erro ao carregar os eventos. Tente novamente mais tarde",
            })
          }
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Erro ao carregar os eventos. Tente novamente mais tarde",
          })
        })
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
      const moreInfo =
        (
          await axios.get(`/event/getData/${eventId}`, {
            headers: {
              "X-event-id": eventId,
            },
          })
        ).data.event ?? {}

      await axios
        .get(`/ecommerce/getInfo?eventId=${eventId}`, {
          headers: {
            "X-event-id": eventId,
          },
        })
        .then((res) => {
          const info = res.data.info

          if (info) {
            resolve({
              ok: true,
              data: {
                ...info,
                ...moreInfo,
              },
            })
          } else {
            reject({
              error:
                "Erro ao carregar as informações do evento. Tente novamente mais tarde",
            })
          }
        })
        .catch(() => {
          resolve({
            ok: false,
            error:
              "Erro ao carregar as informações do evento. Tente novamente mais tarde",
          })
        })
    } catch (error) {
      reject({
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
          resolve({
            ok: true,
            data: { list },
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

const getMyTickets: TApi["get"]["myTickets"] = async ({ eventId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const d = new Date()
      const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`

      await axios
        .get(
          `${eventId}/ecommerce/orders?dateStart=2024-01-01&dateEnd=${todayStr}&status=`
        )
        .then(({ data }) => {
          const list = Array.isArray(data.orders) ? data.orders : []

          resolve({
            ok: true,
            data: { list },
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
          username: name,
          fone: phone,
          email,
        })
        .then((res) => {
          resolve({ ok: true, data: res.data })
        })
        .catch(() => {
          resolve({
            ok: false,
            error: "Algo deu errado. Tente novamente mais tarde.",
          })
        })
    } catch (error) {
      reject({ error: "Erro ao cadastrar usuário. Tente novamente mais tarde" })
    }
  })
}

const requestCode: TApi["post"]["login"]["requestCode"] = async ({ phone }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post("/ecommerce/requestCode", {
          fone: phone,
          database: "DB4b9313e3cee08d9ac3d144e18870bc0db20813cd",
        })
        .then((res) => {
          const uObj = {
            ...res.data.user,
            cpf: res.data.roleData.cpf,
            fone: res.data.roleData.fone,
          }

          localStorage.setItem("token", res.data.token)

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

          localStorage.setItem("token", res.data.token)

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
 * Purchase
 */

const signPurchase: TApi["post"]["purchase"]["sign"] = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = localStorage.getItem("token")

      await axios
        .post("/ecommerce/buyTicket", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

const mpGenerate: TApi["post"]["purchase"]["mpGenerate"] = async ({
  body,
  iKey,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = localStorage.getItem("token")

      await axios
        .post("https://api.mercadopago.com/v1/payments", body, {
          headers: {
            Authorization: `Bearer ${token}`,
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
  },
}
