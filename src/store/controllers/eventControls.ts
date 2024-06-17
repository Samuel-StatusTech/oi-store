import { TEventControls, TSet } from "../../utils/@types/store"
import { TEventData } from "../../utils/@types/data/event"

const eventControls = (set: TSet): TEventControls => {
  return {
    setData: (data: TEventData) => {
      set((store) => ({ ...store, event: data }))
    },
    clear: () => {
      set((store) => ({ ...store, event: null }))
    },
  }
}

export default eventControls
