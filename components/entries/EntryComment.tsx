/* eslint-disable @next/next/no-img-element */
import React from "react";
import s_list from '../../styles/Listing.module.scss'
import s_entr from '../../styles/Entry.module.scss'
import parse from 'html-react-parser'

export default function EntryComment(props) {
    const {comment, current, setCurrent} = props
    const styles = {...s_list, ...s_entr}
    const stopPropagation = (e) => e.stopPropagation()
    
    const [collapsed, setCollapsed] = React.useState(false)
    let parsedComment = !collapsed && parse(comment?.data?.body_html ?? '')
    if (typeof parsedComment === 'string') {
        parsedComment = parse(parsedComment)
    }

    const isCurrent = current === comment?.data?.id

    return (
    <div 
        key={comment?.data?.permalink}
        className={`
            ${styles.article} 
            ${styles.comment} 
            ${collapsed && styles.collapsed}
            ${isCurrent && styles.current }
        `}
        // onClick={e => {
        //     stopPropagation(e)
        //     setCollapsed(!collapsed)
        // }}
        // onMouseOver={stopPropagation}
        // onMouseMove={stopPropagation}
        >
        <div className={styles.postLabelContainer}>
            <div className={styles.subtext}
                onClick={() => setCollapsed(old => !old)}
                onMouseEnter={() => setCurrent(comment?.data?.id ?? '')}
                onMouseLeave={() => isCurrent && setCurrent(null)}
            >
                <img
                    src={comment}
                    alt=""
                />

                u/{comment?.data?.author}
                
                <div style={{whiteSpace: 'pre'}}>{' '}</div>

                <div className={`${styles.upvotes} ${
                    comment?.data.score > 0 ? styles.positive
                    : comment?.data.score < 0 ? styles.negative : ''}`}>
                    {comment?.data.score}
                </div>

                <div style={{whiteSpace: 'pre'}}>{' '}</div>

                {` ${collapsed ? comment?.data?.body : ''}`}
            </div>

            {/* {!collapsed && comment?.data?.body} */}
            
            {parsedComment}

            {/* <div>
                {!collapsed && parse(comment?.data?.body_html ?? '')}
            </div> */}
            
            <div style={{
                // paddingLeft: '4px'
                marginRight: '0'
            }}
            >
                {
                !collapsed
                && comment?.data?.repies !== ''
                // && comment?.data?.replies?.kind === 't1'
                && comment?.data?.replies?.data?.children?.map(reply => (
                    reply?.kind === 't1'
                    ? <EntryComment 
                        comment={reply} 
                        current={current}
                        setCurrent={setCurrent}
                        key={reply?.data?.permalink}
                    />
                    : '...'
                ))
                }
            </div>
        </div>
    </div>
    )
}