import { TUserControls, TSet } from "../../utils/@types/store"
import { TUser } from "../../utils/@types/data/user"

const userControls = (set: TSet): TUserControls => {
  return {
    setData: (data: TUser) => {
      set((store) => ({ ...store, user: data }))
    },
    clear: () => {
      set((store) => ({ ...store, user: null }))
    },
  }
}

export default userControls
