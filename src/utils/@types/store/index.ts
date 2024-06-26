import { TEventData } from "../data/event"
import { TUser } from "../data/user"

// Shelfs

export type TEventShelf = TEventData | null
export type TUserShelf = TUser | null

// Controls

export type TEventControls = {
  setData: (eventData: TEventData) => void
  clear: () => void
}

export type TUserControls = {
  setData: (userData: TUser) => void
  clear: () => void
}

// Data

export type TStore = {
  user: TUserShelf
  event: TEventShelf
  controllers: {
    event: TEventControls
    user: TUserControls
  }
}

export type TSet = (
  partial: (state: TStore) => TStore | Partial<TStore>,
  replace?: boolean | undefined
) => void
