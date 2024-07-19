export const temporizadorDeCincoMinutos = () => {
  const tempoTotalEmSegundos = 5 * 60
  let tempoRestante = tempoTotalEmSegundos
  let timerId: any
  let start = Math.ceil(new Date().getTime() / 1000)

  const formatarTempo = (tempo: any) => {
    const minutos = Math.floor(tempo / 60)
    const segundos = tempo % 60
    return `${minutos.toString().padStart(2, "0")}:${segundos
      .toString()
      .padStart(2, "0")}`
  }

  const atualizarTempo = () => {
    const now = Math.ceil(new Date().getTime() / 1000)
    const elapsed = (start - now) * -1
    tempoRestante =
      elapsed < tempoTotalEmSegundos ? tempoTotalEmSegundos - elapsed : 0
  }

  const iniciar = () => {
    timerId = setInterval(() => {
      tempoRestante--
      if (tempoRestante === 0) {
        parar()
      }
    }, 1000)
  }

  const parar = () => {
    clearInterval(timerId)
  }

  const reiniciar = () => {
    tempoRestante = tempoTotalEmSegundos
    parar()
    iniciar()
  }

  const tempoAtualFormatado = () => {
    return formatarTempo(tempoRestante)
  }

  return {
    iniciar,
    parar,
    reiniciar,
    tempoAtualFormatado,
    atualizarTempo,
  }
}
