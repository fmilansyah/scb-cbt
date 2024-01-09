export const millisecondToMinute = (millisecond: number = 0) => {
  const totalSeconds = Math.floor(millisecond / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)

  return `${("0" + (totalMinutes % 60)).slice(-2)}:${("0" + (totalSeconds % 60)).slice(-2)}`
}
