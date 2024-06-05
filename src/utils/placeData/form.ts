import { TTicketDisposal } from "../@types/data/ticket"

export const initialForm = {
  buyer: {
    name: "",
    phone: "",
    cpf: "",
  },
  tickets: [] as TTicketForm[],
  card: {
    number: "",
    date: "",
    code: "",
    name: "",
    address: "",
  },
}

export type TTicketForm = Partial<TTicketDisposal> & {
  person: {
    name: string
  }
}

export type TForm = typeof initialForm
