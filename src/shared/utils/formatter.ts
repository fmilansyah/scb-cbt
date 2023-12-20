export const isKeyAvailable = (key: any) => {
  return key !== undefined && key !== null && key !== '' && key !== '-'
}

export const isKeyNotAvailable = (key: any) => {
  return key === undefined || key === null || key === ''
}
