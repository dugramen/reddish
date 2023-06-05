import { useContext, useState } from "react"
import { fetchAuth } from "./utils"

import { AuthContext } from "../pages"

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

            <button>↩️</button>

        </div>
    )
}