import React from "react";
import EntryComment from "../entries/EntryComment";
// import Listing from "../Listing";
import styles from '../../styles/CommentsPanel.module.scss';
import { fetchData } from "../utils";

export default function CommentsPanel({permalink, setRef}) {
    const [comments, setComments] = React.useState<any>()

    React.useEffect(() => {
        if (permalink) {
            const url = `api.reddit.com${permalink}.json`
            fetchData(url, data => {
                setComments(data?.[1]?.data)
            })
        }
    }, [permalink])

    return (
        <div className={styles.CommentsPanel} ref={el => setRef(el)}>
            {comments?.children?.map((comment, index) => (
                <EntryComment
                    comment={comment}
                    key={comment?.data?.permalink ?? index}
                />
            )) ?? []}
        </div>
    )
}