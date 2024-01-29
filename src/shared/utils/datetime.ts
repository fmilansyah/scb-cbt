export const millisecondToMinute = (millisecond: number = 0) => {
  const totalSeconds = Math.floor(millisecond / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)

  return `${("0" + (totalMinutes % 60)).slice(-2)}:${("0" + (totalSeconds % 60)).slice(-2)}`
}

export const secondToMinute = (second: number = 0, withUnits: boolean = true) => {
  if (second > 60) {
    let minute: number | string = Math.round(second / 60)
    if (withUnits) {
      minute = String(minute) + ' Menit'
    }
    return minute
  }
  let secondVal: number | string = second
  if (withUnits) {
    secondVal = String(secondVal) + ' Detik'
  }
  return secondVal
}
