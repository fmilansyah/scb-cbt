export const normalizePagination = (pagination: any) => {
  if (pagination.current_page !== undefined) {
    pagination.current = pagination.current_page
  }
  if (pagination.perpage !== undefined) {
    pagination.pageSize = pagination.perpage
  }
  return pagination
}

export const serialize = (obj: any) => {
  let str = []
  for (let p in obj)
    if (obj.hasOwnProperty(p) && obj[p] != undefined) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  return str.join('&')
}

export const parseIntOrNull = (obj: number | string | undefined) => {
  if (typeof obj == undefined) return null as any
  let result = parseInt(obj as string)
  return !isNaN(result) ? result : (null as any)
}

export const menuChecker = (url: string) => {
  if (url) {
    if (url === '/' && url === location.pathname) {
      return true
    } else if (url !== '/' && location.pathname.includes(url)) {
      return true
    }
  }
  return false
}
