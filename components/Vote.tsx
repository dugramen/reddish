import { useContext, useEffect, useState } from "react"
import { fetchAuth } from "./utils"
import st from '../styles/Vote.module.scss';

import { AuthContext } from "../pages"
import { ModalsContext } from "./Panels/PostsPanel";
import { createPortal } from "react-dom";

import { faCaretUp as upIcon, faCaretDown as downIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Vote({id}) {
    const [currentDir, setCurrentDir] = useState('0')
    const [info, setInfo] = useState<any>({})
    const authenticated = useContext(AuthContext)

    function fetchInfo() {
        fetchAuth(`https://oauth.reddit.com/api/info?id=${id}`)
        .then(res => res.json())
        .then(data => {
            const inf = data?.data?.children?.[0]?.data
            const dir = inf?.likes === true 
                ? '1' 
                : inf?.likes === false
                ? '-1' 
                : '0'
            console.log(inf, inf?.likes)
            setInfo(inf)
            setCurrentDir(dir)
        })
    }

    useEffect(() => {
        fetchInfo()
    }, [id])

    function vote(dir: '1' | '0' | '-1') {
        const newDir = dir === currentDir ? '0' : dir
        // setCurrentDir(newDir)
        fetchAuth('https://oauth.reddit.com/api/vote', {
            method: "POST",
            body: new URLSearchParams({
                id: `${id}`,
                dir: newDir,
                headers: JSON.stringify({
                    'Content-Type': 'application/x-www-form-urlencoded',
                })
            }),
        })
        .then(() => {
            fetchInfo()
        })
    }
    
    // if (!authenticated || !id) {
    //     return <></>
    // }
    return (
        <div className={st.VotingContainer}>
            <FontAwesomeIcon
                icon={upIcon}
                onClick={() => vote('1')}
                className={`${st.iconButton} ${st.up} ${currentDir === '1' && st.current}`}
            />

            <div>
                {info?.ups 
                // + parseInt(currentDir)
                }
            </div>

            <FontAwesomeIcon
                icon={downIcon}
                onClick={() => vote('-1')}
                className={`${st.iconButton} ${st.down} ${currentDir === '-1' && st.current}`}
            />

            <button onClick={() => {
                fetchAuth('https://oauth.reddit.com/api/save', {
                    method: "POST",
                    body: new URLSearchParams({
                        id: `${id}`,
                        headers: JSON.stringify({
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'User-Agent': 'Reddish:1.0 (by /u/dugtrioramen)',
                        })
                    })
                })
            }}>⭐</button>

            {/* <button>↩️</button> */}

            <ReplyButton id={id}/>

        </div>
    )
}

function ReplyButton({id}) {
    const [text, setText] = useState("")
    const [open, setOpen] = useState(false)

    return <Modal
        value={open}
        onChange={setOpen}
        buttonContent={"↩️ Reply"}
        id={id}
    >
        <div className={`${st.Reply}`}>
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
            ></textarea>
            <button
                onClick={() => {
                    console.log(text)
                    setOpen(false)
                    text && fetchAuth('https://oauth.reddit.com/api/comment', {
                        method: "POST",
                        body: new URLSearchParams({
                            parent: `${id}`,
                            text: text,
                            headers: JSON.stringify({
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'User-Agent': 'Reddish:1.0 (by /u/dugtrioramen)',
                            })
                        })
                    })
                }}
            >
                Submit
            </button>
        </div>
    </Modal>
}

export function Modal(p: {value?, onChange?, buttonContent, children?, id}) {
    const [open, setOpenRaw] = useState(p.value ?? false)
    const [activeModals, setActiveModals] = useContext(ModalsContext)
    const [portalContainer, setPortalContainer] = useState<HTMLElement>()

    const setOpen = a => {``
        p.onChange 
        ? p.onChange(a)
        : setOpenRaw(a)
    }

    useEffect(() => {
        p.value !== undefined && setOpenRaw(p.value)
    }, [p, p.value])

    useEffect(() => {
        setPortalContainer(document.getElementById('modal-portal-container')!)
    }, [])

    useEffect(() => {
        if (open) {
            setActiveModals(old => ({
                ...old,
                [p.id]: true
            }))
        } else {
            setActiveModals( 
                old => ( ( {[p.id]: leftOut = '', ...rest} ) => rest )(old) 
            )
        }
    }, [open, p.id, setActiveModals])

    return <>
        <button onClick={() => setOpen(true)}>
            {p.buttonContent ?? "Press Me"}
        </button>

        {portalContainer && createPortal(
            <div 
                className={`
                    ${st.Modal} 
                    ${open ? st.open : st.closed}
                `}
                onClick={() => setOpen(false)}
            >
                <div onClick={e => e.stopPropagation()}>
                    {p.children}
                </div>
            </div>
        , portalContainer)}
    </>
}