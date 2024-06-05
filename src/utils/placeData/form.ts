import { TTicketDisposal } from "../@types/data/ticket"

export const initialForm = {
  buyer: {
    name: "",
    surname: "",
    email: "",
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
    surname: string
  }
}

export type TForm = typeof initialForm
