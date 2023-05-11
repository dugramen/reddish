import React from "react";
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from '../../styles/Listing.module.scss'
import SearchBar from "../SearchBar";
import Listing from "../Listing";
import EntryPost from "../entries/EntryPost";


export default function ListingPanel({name, listing, posts, setPage, setCurrentPost, currentPost, searchType, setSearchType, setSubreddit, subreddit}) {
    // const {listing, posts, setPage, setCurrentPost, currentPost} = props
    // const parentRef = React.useRef()
    return (
        <div className={styles.listingPanel} id={searchType === 'r/' ? 'Subreddit' : 'User'}>
            <SearchBar 
                {...{searchType, setSearchType, setSubreddit, subreddit}} 
            />

            <Listing 
                // dataLength={Object.keys(posts).length} 
                next={() => setPage(`&after=${listing?.data?.after}`)}
                sourceUrl={undefined}
                id='ListingPanelListing'
                // sourceUrl={`${searchType}/${subreddit}`}            
            >
                {Object.values(posts).filter((p:any) => p.kind==='t3').map((post: any, index) => (
                    <EntryPost 
                        post={post} 
                        isCurrent={(currentPost?.permalink ?? '') === post.data.permalink} 
                        setCurrentPost={() => setCurrentPost(post.data)} 
                        postType={searchType}
                        key={post?.data?.permalink ?? index}
                    />
                ))}
            </Listing>
        </div>
    )
}