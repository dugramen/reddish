import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCookie, setCookie} from 'cookies-next';
import { refreshAccessToken } from '../../components/Login';
import queryString from 'query-string';

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


function fetchReddit({url, token, req, res, method, body, headers}, hasRefreshed = false) {
    const options = {
        method: method || 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            'User-Agent': 'Reddish:1.0 (by /u/dugtrioramen)',
            ...headers
        },
        body: body || undefined
    }
    // console.log('head  - ' , options)
    return fetch(url, options)
    .then(async response => {
        // console.log(response)
        // console.log(response)
        if (response.status === 200) {
            return response
        } 
        else if (hasRefreshed) {
            console.log(response)
            return "Keeps failing"
        }
        else if (response.status === 403 || response.status === 401 || response.status === 404) {
            const newToken = await refreshAccessToken(req, res)
            return fetchReddit({url, token: newToken, req, res, method, body, headers}, true)
            
        }
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Run cors

    await cors(req, res);
    const rawQueryUrl = req.query.url as string
    const auth = req.query.auth
    let {method, body: {headers, ...body}} = req

    const token = getCookie('access_token', {req, res})
    let url = decodeURIComponent(rawQueryUrl ?? '')


    body = queryString.stringify(body)
    headers = headers ? JSON.parse(decodeURIComponent(headers ?? '')) : {};
    // headers = (headers && JSON.parse(body.headers)) ?? {}

    
    if (method) {
        console.log(method)
        console.dir(body)
        console.log(headers)
    }
    
    let result 
    if (!auth) {
        result = await fetch(url)
        console.log('no auth')
    } else {
        result = await fetchReddit({url, token, req, res, method, body, headers})
        console.log('authed ', result)
    }

    let data
    try {
        data = await result?.json?.()
    } catch (error) {
        console.error(error)
    }
    console.log('76 - ', url, data)
    res.json(data)
    
    
    
    // req.url?.replace('/api/cors/', '') ?? '';
    // url = 'https://' + url
    // console.log(url)

    // try {
    //     const response = await fetch(url)
    //     const data = await response.json()
    //     res.json( data );
    // } catch {
    //     res.json('Failed request ' + url)
    // }

    // res.json('Failed request')
}