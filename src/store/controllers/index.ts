import { TSet } from "../../utils/@types/store"
import eventControls from "./eventControls"

const controls = (set: TSet) => ({
  event: eventControls(set),
})

export default controls
