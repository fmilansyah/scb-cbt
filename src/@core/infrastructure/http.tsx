import { StorageConst } from '@/shared/constants/storage'
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import { BaseResponse } from '../domain/entities/response/base.response'

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
  return response
}
const onResponseError = (error: AxiosError<BaseResponse<any>>): Promise<AxiosError> => {
  let color = 'danger'
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    color = 'warning'
  }
  const toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    showCloseButton: true,
    customClass: {
      popup: `color-${color}`,
    },
  });
  toast.fire({
    title: error?.response?.data?.message,
  });
  return Promise.reject(error)
}
http.interceptors.response.use(onResponse, onResponseError)
