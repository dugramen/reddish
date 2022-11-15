import React from "react";
import EntryComment from "../entries/EntryComment";
import Listing from "../Listing";
import { fetchData } from "../utils";

export default function CommentsPanel({permalink}) {
    const [comments, setComments] = React.useState<any>()

    React.useEffect(() => {
        if (permalink) {
            const url = `https://api.reddit.com${permalink}.json`
            fetchData(url, data => {
                setComments(data?.[1]?.data)
            })
        }
    }, [permalink])

    return (
    <div style={{
        // paddingRight: '12px'
    }}>
        <Listing 
            next={undefined} 
            sourceUrl={permalink} 
            id={'CommentsPanel'}
            style={{

            }}
        >
            {comments?.children?.map(comment => (
                <EntryComment
                    comment={comment}
                    key={comment?.data?.permalink}
                />
                // <div>
                // </div>
            )) ?? []}
        </Listing>
    </div>
    )
}