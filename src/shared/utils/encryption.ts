import cryptoJs from 'crypto-js'

export const aes = (plainText: string = '') => {
  return cryptoJs.AES.encrypt(plainText, process?.env?.ENCRYPTION_KEY ?? '').toString()
}

export const md5 = (plainText: string = '') => {
  return cryptoJs.MD5(plainText).toString()
}
