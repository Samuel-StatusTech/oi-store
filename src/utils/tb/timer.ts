export const clockdown = (seconds: number, endCallback?: () => void) => {
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
    timerId = setInterval(() => {
      timeLeft--
      if (timeLeft === 0) {
        stop()
        endCallback && endCallback()
      }
    }, 1000)
  }

  const stop = () => {
    clearInterval(timerId)
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
