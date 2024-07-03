import axios from "axios"
import { TApi } from "../utils/@types/api"

axios.defaults.baseURL = "https://api.oitickets.com.br/api/v1"
axios.defaults.headers.common.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZqTFpROEQyOVBmQ3dJMlNiS3dQZ0I3cjdnRDMiLCJkYXRhYmFzZSI6IkRCNGI5MzEzZTNjZWUwOGQ5YWMzZDE0NGUxODg3MGJjMGRiMjA4MTNjZCIsImNsaWVudEtleSI6Ii1OYWxaenZiMndhc1VfNmR1R2NuIiwiaWF0IjoxNzE3NDk1MzQzLCJleHAiOjE5NzQxMDMzNDN9.50knxx6WtR8TBD0byCCPo7Qaxe6SV6MXvHujZYYd4rI`

/*
 * Getters
 */

const getQrCode: TApi["get"]["qrcode"] = async ({ order }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post(`https://back-moreira.vercel.app/api/orders/qrcode`, order)
        .then((res) => {
          const info = res.data

          if (info) {
            resolve({
              ok: true,
              data: info.data,
            })
          } else {
            reject({
              error: "Erro ao carregar o qrcode. Tente novamente mais tarde",
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
        .then((res) => {
          const info = res.data.events

          if (info) {
            resolve({
              ok: true,
              data: info,
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
        (await axios.get(`/event/getData/${eventId}`)).data.event ?? {}

      await axios
        .get(`/ecommerce/getInfo?eventId=${eventId}`)
        .then((res) => {
          const info = res.data.info

          if (info) {
            resolve({
              ok: true,
              data: {
                ...moreInfo,
                ...info,
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

const getMyTickets: TApi["get"]["myTickets"] = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .get(`/ecommerce/getMyTickets`)
        .then(({ data }) => {
          if (data.success) {
            const list = Array.isArray(data.shoppings) ? data.shoppings : []
            resolve({
              ok: true,
              data: { list },
            })
          } else {
            resolve({
              ok: false,
              error: "Erro ao listar produtos. Tente novamente mais tarde",
            })
          }
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
 * Create
 */

const login: TApi["post"]["login"] = async ({ username, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post("/ecommerce/authenticate", {
          username,
          password,
          database: "DB4b9313e3cee08d9ac3d144e18870bc0db20813cd",
        })
        .then((res) => {
          const uObj = {
            ...res.data.user,
            cpf: res.data.roleData.cpf,
            fone: res.data.roleData.fone,
          }

          resolve({
            ok: true,
            data: uObj,
          })
        })
        .catch(() => {
          resolve({
            ok: false,
            error:
              "Algo deu errado. Verifique o email e a senha e tente novamente.",
          })
        })
    } catch (error) {
      reject({
        error: "Erro ao conectar na loja. Tente novamente mais tarde",
      })
    }
  })
}

export const Api: TApi = {
  get: {
    qrcode: getQrCode,
    events: getEvents,
    eventInfo: getEventInfo,
    products: getProducts,
    myTickets: getMyTickets,
  },
  post: {
    login: login,
  },
}
