import { TEventData } from "../data/event"

// Shelfs

export type TEventShelf = TEventData | null

// Controls

export type TEventControls = {
  setData: (eventData: TEventData) => void
  clear: () => void
}

// Data

export type TStore = {
  event: TEventShelf
  controllers: {
    event: TEventControls
  }
}

export type TSet = (
  partial: (state: TStore) => TStore | Partial<TStore>,
  replace?: boolean | undefined
) => void
