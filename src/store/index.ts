import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { TStore } from "../utils/@types/store"

import { userShelf } from "./shelfs"
import { eventShelf } from "./shelfs"
import controllers from "./controllers"

const getStore = create<TStore>()(
  devtools(
    persist(
      (set) => ({
        user: userShelf(),
        event: eventShelf(),
        controllers: controllers(set),
      }),
      {
        name: "global",
        partialize: (_) => {
          return {}
        },
      },
    ),
  ),
)

export default getStore
