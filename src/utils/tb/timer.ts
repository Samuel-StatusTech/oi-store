export const clockdown = (
  seconds: number,
  endCallback?: () => void,
  textUpdater?: (newTime?: string | null) => void
) => {
  const startTime = new Date().getTime()

  const totalSeconds = seconds > 0 ? seconds : 0

  let timeLeft = totalSeconds
  let timerId: any

  const formatarTime = (time: any) => {
    const minutes = Math.floor(time / 60)
    const secs = time % 60
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const start = () => {
    stop()

    // Atualiza imediatamente o tempo inicial
    if (textUpdater) {
      const res = formatarTime(totalSeconds)
      textUpdater(res)
    }

    timerId = setInterval(() => {
      const nowTime = new Date().getTime()
      const spended = Math.round((nowTime - startTime) / 1000)

      const newTimeLeft = totalSeconds - spended

      if (newTimeLeft >= 0) {
        timeLeft = newTimeLeft
        if (textUpdater) {
          const res = formatarTime(newTimeLeft)
          textUpdater(res)
        }
      } else {
        stop()
        if (textUpdater) textUpdater(null)
        endCallback && endCallback()
      }
    }, 1000)
  }

  const stop = () => {
    clearInterval(timerId)
    timerId = undefined
  }

  const restart = () => {
    timeLeft = totalSeconds
    stop()
    start()
  }

  const actualTime = () => {
    return timeLeft >= 0 ? formatarTime(timeLeft) : null
  }

  return {
    start,
    stop,
    restart,
    actualTime,
  }
}
