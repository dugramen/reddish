import React from "react";
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from '../../styles/Listing.module.scss'
import moment from "moment";
import Image from "next/image";
import Post from "./Post";
import SearchBar from "../SearchBar";
import Listing from "../Listing";
import EntryPost from "../entries/EntryPost";


export default function ListingPanel({listing, posts, setPage, setCurrentPost, currentPost, searchType, setSearchType, setSubreddit, subreddit}) {
    // const {listing, posts, setPage, setCurrentPost, currentPost} = props
    const parentRef = React.useRef()
    return (
    <div className={styles.listingPanel}>
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
                
                // <div 
                //     className={styles.article + ' ' + ((currentPost?.permalink ?? '') === post.data.permalink && styles.current)}
                //     key={post.data.permalink}
                //     onClick={e => {
                //         console.log('pressed')
                //         setCurrentPost(post.data)
                //     }}
                // >
                //     {post.data.preview?.images.length > 0 && 
                //     <img
                //         src={(post.data.preview.images[0].source.url).replaceAll('amp;', '')}
                //         width={100}
                //         height={100}
                //         alt='preview'
                //     />}

                //     <div className={styles.postLabelContainer}>
                //         <div className={styles.postHeader}>
                //             {
                //             searchType === 'r/'
                //             ?
                //                 <div className={styles.author}>
                //                     {`u/${post.data.author}`}
                //                 </div>
                //             :
                //                 <div className={styles.author}>
                //                     {`r/${post.data.subreddit}`}
                //                 </div>
                //             }

                //             <div className={styles.createTime}>
                //                 {moment(new Date(post.data.created_utc * 1000)).fromNow()}
                //             </div>
                //         </div>

                //         <div className={styles.title}>
                //             {post.data.title}
                //         </div>

                //     </div>

                //     <div className={styles.postFooter}>
                //         <div className={`${styles.upvotes} ${
                //             post.data.ups > 0 ? styles.positive
                //             : post.data.ups < 0 ? styles.negative : ''}`}>
                //             {post.data.ups}
                //         </div>

                //         <div className={styles.comments}>
                //             <img 
                //                 src="/comments.svg" 
                //                 alt="comments.svg"            
                //             />
                //             {post.data.num_comments}
                //         </div>
                //     </div>

                // </div>
                ))}
        </Listing>

        {/* <div className={styles.articleContainer} id={'InfiniteScrollRef'}>

            <InfiniteScroll
                dataLength={Object.keys(posts).length} //This is important field to render the next data
                next={() => setPage(`&after=${listing?.data?.after}`)}
                hasMore={true}
                scrollableTarget={'InfiniteScrollRef'}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
                {Object.values(posts).filter((p:any) => p.kind==='t3').map((post: any) => (
                <div 
                    className={styles.article + ' ' + ((currentPost?.permalink ?? '') === post.data.permalink && styles.current)}
                    key={post.data.permalink}
                    onClick={e => {
                        console.log('pressed')
                        setCurrentPost(post.data)
                    }}
                >
                    {post.data.preview?.images.length > 0 && 
                    <img
                        src={(post.data.preview.images[0].source.url).replaceAll('amp;', '')}
                        width={100}
                        height={100}
                        alt='preview'
                    />}

                    <div className={styles.postLabelContainer}>
                        <div className={styles.postHeader}>
                            {
                            searchType === 'r/'
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

                    </div>

                    <div className={styles.postFooter}>
                        <div className={`${styles.upvotes} ${
                            post.data.ups > 0 ? styles.positive
                            : post.data.ups < 0 ? styles.negative : ''}`}>
                            {post.data.ups}
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
                ))}
            </InfiniteScroll>

            <div>
                <button
                    onClick={() => setPage(`&before=${listing?.data?.before}`)}
                >
                    Previous
                </button>

                <button
                    onClick={() => setPage(`&after=${listing?.data?.after}`)}
                >
                    Next
                </button>
            </div>
        </div> */}
    </div>
    )
}