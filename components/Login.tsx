import {getCookie, setCookie} from 'cookies-next';

const DURATION = "permanent";
const SCOPE = "identity edit flair history read vote save wikiread wikiedit mysubreddits ";
const REDIRECT_URI = "http://localhost:3000/auth";
const RANDOM_STRING = "randomestringhere";
const RESPONSE_TYPE = "code";
const CLIENT_ID = "v3h0CQpo9aENBrnWF-lL_w";
const CLIENT_SECRET = "H75i3bVOtmmmAh_EHGK3aN9TlF6Wpw";

const url = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&state=${RANDOM_STRING}&redirect_uri=${REDIRECT_URI}&duration=${DURATION}&scope=${SCOPE}`;

export default function Login({}) {
    return <a
        href={url}
    > Login </a>
}

export const getToken = async (body, req, res) => {
    return fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(
                `${CLIENT_ID}:${CLIENT_SECRET}`
            ).toString("base64")}`,
            "content-type": "application/x-www-form-urlencoded",
        },
        body: body,
    })
    .then(response => response?.json())
    .then(data => {
        setCookie('access_token', data.access_token, {
            httpOnly: true, 
            maxAge: 60 * 60 * 24,
            req: req,
            res: res,
        })
        
        setCookie('refresh_token', data.refresh_token, {
            httpOnly: true,
            req: req,
            res: res,
        })
        return data
    })
}

export const getAccessTokenFromCode = async (code, req, res) => {
    const data = await getToken(new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
    }), req, res)
    fetch('https://oauth.reddit.com/api/v1/me', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${data.access_token}`
        }
    })
    .then(a => {
        console.log('60 - ', a)
        return a.json()
    })
    .then(b => console.log('64 - ', b))
    return data.access_token
}

export const refreshAccessToken = async (req, res) => {
    const refreshToken = getCookie('refresh_token', {req, res})
    if (refreshToken && refreshToken !== true) {
        const data = await getToken(new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }), req, res)
        return data.access_token
    }
}