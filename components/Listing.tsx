import { type } from "os";
import React from "react";
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from '../styles/Listing.module.scss'

interface ListingProps {
    next: any,
    sourceUrl: any,
    id: any,
    className?: any,
    children?: any,
    style?: any
}

export default function Listing({next, children, sourceUrl, id, className, style}: ListingProps) {
    // const {dataLength, next} = props
    const scrollRef = React.useRef<any>()

    React.useEffect(() => {
        if (scrollRef?.current) {
            scrollRef.current.scrollTop = 0
        }
    }, [sourceUrl])

    return (
    <div 
        className={styles.articleContainer + ' ' + (className ?? '')} 
        id={id}
        ref={scrollRef}
        style={style ?? {}}
    >
        <InfiniteScroll
            dataLength={children?.length} //This is important field to render the next data
            next={next}
            hasMore={true}
            scrollableTarget={id}
            loader={<h4></h4>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>
            }
        >
            {children}
        </InfiniteScroll>
    </div>
    )
}