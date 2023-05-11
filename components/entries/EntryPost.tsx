import React from "react";
import moment from "moment";
import styles from '../../styles/Listing.module.scss'

export default function EntryPost({post, isCurrent, setCurrentPost, postType}) {
    return (
    <div 
        className={styles.article + ' ' + (isCurrent && styles.current)}
        key={post.data.permalink}
        onClick={e => {
            console.log('pressed')
            setCurrentPost(post)
        }}
    >
        {post.data.preview?.images.length > 0 && 
        <img
            src={(post.data.preview.images[0].source.url).replaceAll('amp;', '')}
            width={48}
            height={48}
            alt='preview'
        />}

        <div className={styles.postLabelContainer}>
            <div className={styles.postHeader}>
                {
                postType === 'r/'
                ?
                    <div className={styles.author}>
                        {`u/${post.data.author}`}
                    </div>
                :
                    <div className={styles.author}>
                        {`r/${post.data.subreddit}`}
                    </div>
                }

                <div className={styles.createTime}>
                    {moment(new Date(post.data.created_utc * 1000)).fromNow()}
                </div>
            </div>

            <div className={styles.title}>
                {post.data.title}
            </div>

            <div className={styles.postFooter}>
                <div className={`${styles.upvotes} ${
                    post.data.score > 0 ? styles.positive
                    : post.data.score < 0 ? styles.negative : ''}`}>
                    {post.data.score}
                </div>

                <div className={styles.comments}>
                    <img 
                        src="/comments.svg" 
                        alt="comments.svg"            
                    />
                    {post.data.num_comments}
                </div>
            </div>
        </div>


    </div>
    )
}