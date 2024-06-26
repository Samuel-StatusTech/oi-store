import { TSet } from "../../utils/@types/store"
import eventControls from "./eventControls"
import userControls from "./userControls"

const controls = (set: TSet) => ({
  event: eventControls(set),
  user: userControls(set),
})

export default controls
