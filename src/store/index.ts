import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { eventShelf } from "./shelfs"
import { TStore } from "../utils/@types/store"
import controllers from "./controllers"

const getStore = create<TStore>()(
  devtools(
    persist(
      (set) => ({
        event: eventShelf(),
        controllers: controllers(set),
      }),
      {
        name: "global",
        partialize: (store) => {
          return {
            event: store.event,
          }
        },
      }
    )
  )
)

export default getStore
