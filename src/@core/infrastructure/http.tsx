import { StorageConst } from '@/shared/constants/storage'
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

export const http: AxiosInstance = axios.create({
  baseURL: `/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  let token: string | undefined = Cookies.get(StorageConst.UserKey)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
}
http.interceptors.request.use(onRequest, onRequestError)

const onResponse = (response: AxiosResponse): AxiosResponse => {
  console.info(`[response] [${JSON.stringify(response)}]`)
  return response
}
const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[response error] [${JSON.stringify(error)}]`)
  return Promise.reject(error)
}
http.interceptors.response.use(onResponse, onResponseError)
