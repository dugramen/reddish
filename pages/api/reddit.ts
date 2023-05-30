import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCookie, setCookie} from 'cookies-next';
import { refreshAccessToken } from '../../components/Login';

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


function fetchReddit(url, token, req, res, hasRefreshed = false) {
    return fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            content_type: "application/json",
        },
    })
    .then(async response => {
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
            return fetchReddit(url, newToken, req, res, true)
            
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

    const token = getCookie('access_token', {req, res})
    // console.log(token)
    // const prefix = "https://api.reddit.com/"
    let url = decodeURIComponent(rawQueryUrl ?? '')
    
    
    let result 
    if (!auth) {
        result = await fetch(url)
        console.log('should run')
    } else {
        result = await fetchReddit(url, token, req, res)
        console.log('should not run')
    }
    console.log('76 - ', url, result)
    const data = await result?.json?.()
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