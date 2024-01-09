import { NetworkService } from '@/shared/constants/network'
import { Platform } from '@/shared/constants/platform'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const queryUrl = req.query.url as string[]
  const reqUrl: string = queryUrl.join('/')

  let baseUrl = ''
  switch (req.headers[NetworkService.KEY]) {
    case NetworkService.CORE:
      baseUrl = `${process.env.API_CORE_URL}`
      break
    case NetworkService.LMS:
      baseUrl = `${process.env.API_LMS_URL}`
      break
    case NetworkService.ASSESSMENT:
      baseUrl = `${process.env.API_ASSESSMENT_URL}`
      break
  }
  const config = {
    method: req.method,
    url: `${baseUrl}/${reqUrl}`,
    data: req,
    params: req.query,
    headers: {
      ...{
        'x-api-key': process.env.API_KEY,
        subdomain: 'smkqelopak',
        platform: Platform,
        Authorization: req.headers.authorization,
        'Content-Type': req.headers['content-type'],
      },
      // ...req.headers,
    },
  }
  axios
    .request(config)
    .then((resp) => {
      res.status(200).send(resp.data)
      res.end()
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
        res.status(error.response.status).send(error.response.data)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
      res.status(400).send(error)
    })
}
