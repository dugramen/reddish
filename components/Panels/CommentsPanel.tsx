import React from "react";
import EntryComment from "../entries/EntryComment";
// import Listing from "../Listing";
import styles from '../../styles/CommentsPanel.module.scss';
import { fetchData } from "../utils";

export default function CommentsPanel({permalink, setRef, open, setOpen}) {
    const [comments, setComments] = React.useState<any>()
    const [current, setCurrent] = React.useState<any>(null)


    React.useEffect(() => {
        if (permalink) {
            const url = `https://api.reddit.com${permalink}.json`
            fetchData(url, data => {
                console.log(data?.[1]?.data)
                setComments(data?.[1]?.data)
            })
        }
    }, [permalink])

    return (
        <div className={`${styles.CommentsPanel} ${open ? styles.open : styles.closed}`} ref={el => setRef?.(el)}>
            {comments?.children?.map((comment, index) => (
                <EntryComment
                    comment={comment}
                    current={current}
                    setCurrent={setCurrent}
                    key={comment?.data?.permalink ?? index}
                />
            )) ?? []}
        </div>
    )
}