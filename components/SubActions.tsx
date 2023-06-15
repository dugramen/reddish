import { fetchAuth } from "./utils";
import st from '../styles/Vote.module.scss';
import { Modal } from "./Vote";
import { useContext, useEffect, useState } from "react";
import parse from 'html-react-parser';
import { url } from "inspector";
import { AuthContext } from "../pages";

export default function SubActions({id = '', isSub = false}) {
    const [info, setInfo] = useState({})
    const authenticated = useContext(AuthContext)

    useEffect(() => {
        fetch(`https://www.reddit.com/r/${id}/about.json`)
        .then(res => res.json())
        .then(data => {
            console.log('subreddit information - ', data)
            setInfo(data.data)
        })
        .catch(console.log)
    }, [id])

    return <>
        <button
            onClick={() => {
                isSub 
                ? fetchAuth('https://oauth.reddit.com/api/subscribe', {
                    method: "POST",
                    body: new URLSearchParams({
                        action: "sub",
                        sr_name: id,
                        headers: JSON.stringify({
                            'Content-Type': 'application/x-www-form-urlencoded'
                        })
                    })
                })
                : fetchAuth('https://oauth.reddit.com/api/follow', {
                    method: "Post",
                    body: new URLSearchParams({
                        action: "follow",
                        user: id,
                        headers: JSON.stringify({
                            'Content-Type': 'application/x-www-form-urlencoded'
                        })
                    })
                })
            }}
        >
            + Follow
        </button>

        <Modal 
            buttonContent={'ℹ️ Info'} 
            id={id}
        >
            <About info={info}/>
        </Modal>

        <Modal
            buttonContent={'🔍 Filter'}
            id={id}
        >
            <Filters
                id={id}
                isSub={isSub}
                authenticated={authenticated}
            />

            {/* <div>
                {'one,two,three,four'.split(',').map(text => (
                    <label key={text}>
                        <input type="radio" name="sub-filter"/>
                        {text}
                    </label>
                ))}
            </div> */}
        
        </Modal>

    </>
}

function Filters({id, isSub, authenticated}) {
    const [flairs, setFlairs] = useState<any[]>([])

    useEffect(() => {
        let url = `https://oauth.reddit.com/r/${id}/api/link_flair_v2.json?raw_json=1`
        // url = 'https://www.reddit.com/r/pokemon/api/link_flair_v2.json?raw_json=1'
        if (authenticated && isSub) {
            fetchAuth(url, {
                headers: {
                    'User-Agent': 'Reddish:1.0 (by /u/dugtrioramen)',
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
            .then(async res => {
                console.log('fl res - ', res)
                let result
                try {
                    result = await res.json()
                } catch (error) {
                    console.error(error)
                }
                return result
            })
            .then(data => {
                console.log('flair - ', url, data)
                data && setFlairs(data.choices)
            })
        } else {
            setFlairs([])
        }
    }, [id, isSub, authenticated])

    return (
        <div className={st.flairsContainer}>
            {flairs?.map(flair => (
                <label key={flair.flair_template_id}>
                    <input
                        type="radio"
                        name="sub-filter"
                    />
                    {flair.flair_text}
                </label>
            ))}
        </div>
    )
}

function About({info}) {

    let parsed = parse(info?.description_html ?? '')
    if (typeof parsed === 'string') {
        parsed = parse(parsed)
    }

    return (
        <div 
            className={st.About}
        >
            <h2>{info?.title}</h2>

            {parsed}
        </div>
    )
}