import { TProduct } from "../@types/data/product";
import { TTicketDisposal } from "../@types/data/ticket";

export const parseDisposalTickets = (list: TProduct[]): TTicketDisposal[] => {
    let newList: TTicketDisposal[] = []

    list.forEach(ticket => {
        newList.push({
            ...ticket,
            qnt: 0
        })
    })

    return newList
} 