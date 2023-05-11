import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

function initMiddleware(middleware) {
    return (req, res) => new Promise((resolve, reject) => {
        middleware(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }
            return resolve(result)
        })
    })
}

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['OPTIONS'],
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run cors

  await cors(req, res);

  let url = req.url?.replace('/api/cors/', '') ?? '';
  url = 'https://' + url
  // console.log(url)

  try {
    const response = await fetch(url)
    const data = await response.json()
    res.json( data );
  } catch {
    res.json('Failed request ' + url)
  }
  // res.json('Failed request')
}