import { useState } from "react"
import { fetchAuth } from "./utils"


export default function Vote({id}) {
    const [currentDir, setCurrentDir] = useState('0')

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

    return (
        <div className="Vote">
            <button 
                onClick={() => vote('1')}
            >👍</button>

            <button
                onClick={() => vote('-1')}
            >👎</button>
        </div>
    )
}