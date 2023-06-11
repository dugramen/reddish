import { fetchAuth } from "./utils";
import st from '../styles/Vote.module.scss';
import { Modal } from "./Vote";
import { useEffect, useState } from "react";
import parse from 'html-react-parser';

export default function SubActions({id = '', isSub = false}) {
    const [info, setInfo] = useState({})

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
            <div>
                {'one,two,three,four'.split(',').map(text => (
                    <label key={text}>
                        <input type="radio" name="sub-filter"/>
                        {text}
                    </label>
                ))}
            </div>
        
        </Modal>

    </>
}

function About({info}) {

    let parsed = parse(info.description_html ?? '')
    if (typeof parsed === 'string') {
        parsed = parse(parsed)
    }

    return (
        <div 
            className={st.About}
        >
            <h2>{info.title}</h2>

            {parsed}
        </div>
    )
}