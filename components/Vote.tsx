import { useContext, useEffect, useState } from "react"
import { fetchAuth } from "./utils"
import st from '../styles/Vote.module.scss';

import { AuthContext } from "../pages"
import { ModalsContext } from "./Panels/PostsPanel";
import { createPortal } from "react-dom";

export default function Vote({id}) {
    const [currentDir, setCurrentDir] = useState('0')
    const authenticated = useContext(AuthContext)

    function vote(dir: '1' | '0' | '-1') {
        const newDir = dir === currentDir ? '0' : dir
        setCurrentDir(newDir)
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
    }
    
    if (!authenticated) {
        return <></>
    }
    return (
        <div className="Vote">
            <button 
                onClick={() => vote('1')}
            >👍</button>

            <button
                onClick={() => vote('-1')}
            >👎</button>

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
        open={open}
        setOpen={setOpen}
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

function Modal({open, setOpen, buttonContent, children, id}) {
    const [activeModals, setActiveModals] = useContext(ModalsContext)
    const [portalContainer, setPortalContainer] = useState<HTMLElement>()

    useEffect(() => {
        setPortalContainer(document.getElementById('modal-portal-container')!)
    }, [])

    useEffect(() => {
        if (open) {
            setActiveModals(old => ({
                ...old,
                [id]: true
            }))
        } else {
            setActiveModals( 
                old => ( ( {[id]: leftOut = '', ...rest} ) => rest )(old) 
            )
        }
    }, [open])

    return <>
        <button onClick={() => setOpen(true)}>
            {buttonContent ?? "Press Me"}
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
                    {children}
                </div>
            </div>
        , portalContainer)}
    </>
}