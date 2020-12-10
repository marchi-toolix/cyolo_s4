import cookie from 'cookie'

export const getCookie = (name: string) => {
  const cookies = cookie.parse(document.cookie)
  const value = cookies && cookies[name]

  return  value
}