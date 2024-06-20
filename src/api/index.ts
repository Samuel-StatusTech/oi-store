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
      const pbToken =
        "Bearer f4e9071a-4bb9-4060-8757-759cf8b0b20564cdec3640fb9ac8453dbc67a15adebfde6e-2625-4e23-950c-4f5956856ce7"

      await axios
        .post(`https://sandbox.api.pagseguro.com/orders`, order, {
          headers: {
            Authorization: pbToken,
          },
        })
        .then((res) => {
          const info = res.data

          if (info) {
            resolve({
              ok: true,
              data: info,
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

/*
 * Create
 */

export const Api: TApi = {
  get: {
    qrcode: getQrCode,
    events: getEvents,
    eventInfo: getEventInfo,
    products: getProducts,
  },
  // create: {
  //   product: newProduct,
  // },
}