import axios from "axios"
import { TApi } from "../utils/@types/api"
import Cookies from "js-cookie"

axios.defaults.baseURL = "https://api.oitickets.com.br/api/v1"
axios.defaults.headers.common.Authorization = `Bearer ${Cookies.get("dtoken")}`

/*
 * Getters
 */

const getQrCode: TApi["get"]["qrcode"] = async ({ order }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pbToken = Cookies.get("pbtoken")

      await axios
        .post(`https://sandbox.api.pagseguro.com/orders`, order, {
          headers: {
            Authorization: `Bearer ${pbToken}`,
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
