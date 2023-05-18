import {useState, useEffect, useRef, Children, memo} from 'react';
import styles from '../../styles/PostsPanel.module.scss';
import { ImageLoaded, fetchData } from '../utils';
import parse from 'html-react-parser';
import ReactPlayer from 'react-player';
import CommentsPanel from './CommentsPanel';
import anime from 'animejs/lib/anime.es.js';
import ImageGallery from 'react-image-gallery';
import SearchPanel from './SearchPanel';

function st(strings, ...values) {
    const wholeString = strings.reduce((result, str, i) => {
      const value = values[i] !== undefined ? values[i] : '';
      return result + str + value;
    }, '');
  
    return styles[wholeString] + ' '
}

export default function PostsPanel(props) {
    const [currentPost, setCurrentPost] = useState<any>({})
    const [page, setPage] = useState('')
    const [listing, setListing] = useState<any>({})
    const [searchOpen, setSearchOpen] = useState(false)
    const [commentsOpen, setCommentsOpen] = useState(false)
    
    const [searchType, setSearchType] = useState('r/')
    const [searchSafe, setSearchSafe] = useState(false)
    const [subreddit, setSubreddit] = useState('')

    const listingToItems = data => Object.values(data).map((item: any, index) => ({...item, index: index}))
    let items: any[] = listingToItems(listing)

    const [fitHeight, setFitHeight] = useState(true)
    const [controlsShown, setControlsShown] = useState(false)
    
    

    // items = items.filter(item => item.media_metadata)

    const commentsRef = useRef<any>(null)
    const postRef = useRef<any>(null)
    const holdMap = useRef({})
    const thumbnailContainerRef = useRef<HTMLDivElement>(null)
    const [currentThumbnail, setCurrentThumbnail] = useState<HTMLDivElement | null>(null)

    useEffect(() => {
        const thumb = thumbnailContainerRef.current
        const el = currentThumbnail
        if (!thumb || !el) {return}
        const destination = Math.max(
            Math.min(thumb.scrollLeft, el.offsetLeft),
            el.offsetLeft - thumb.clientWidth + el.clientWidth + 8
        )
        thumb.scrollTo({
            left: destination
        })
    }, [currentThumbnail])

    const previousPost = () => setCurrentPost(old => {
        console.log('preved ', items)
        return items[Math.max(old.index - 1, 0)]
    })
    const nextPost = () => setCurrentPost(old => {
        console.log('nexted ', items)
        // thumbnailContainerRef.current?.scrollBy({left: 75, behavior: 'smooth'})
        return items[Math.min(old.index + 1, items.length - 1)]
    })
    const toggleFit = () => setFitHeight(old => !old)

    const scrollPost = (dir: 1 | -1, key) => {
        const scroller: HTMLDivElement = postRef.current
        const held = holdMap.current[key]
        
        const animeScroll = () => anime({
            targets: scroller,
            scrollTop: scroller.scrollTop + dir * 80,
            easing: 'easeOutCubic',
            duration: 400,
        })

        if (held === 1) {animeScroll()}
        if (held === 2) {
            let prevTime = null
            const stepScroll = (currTime) => {
                const currHeld = holdMap.current[key] ?? 0
                if (currHeld <= 1) {
                    animeScroll()
                    return
                }

                let delta = 0
                if (prevTime) {
                    delta = currTime - prevTime
                }

                prevTime = currTime
                const increment = dir * (20 + Math.min(20, currHeld * 2)) * (delta / 16)
                scroller.scrollBy({top: increment})
                requestAnimationFrame(stepScroll)
            }
            requestAnimationFrame(stepScroll)
        }
    }


    const handleKeyPress = (event) => {
        const {key} = event
        console.log(key);
        holdMap.current = {
            ...holdMap.current,
            [key]: (holdMap.current[key] ?? 0) + 1
        }
        const m = {
            'w': () => scrollPost(-1, key),
            'a': previousPost,
            's': () => scrollPost(1, key),
            'd': nextPost,
            'e': toggleFit,
            'q': () => setSearchOpen(old => !old),
            'c': () => setCommentsOpen(old => !old)
            // 'ArrowUp': null,
            // 'ArrowDown': null,
        };
        m[key]?.();
    }
    const handleKeyRelease = (event) => {
        const {key} = event
        const curr = holdMap.current[key] ?? 0
        holdMap.current = {
            ...holdMap.current,
            [key]: 0
        }
    }
    useEffect(() => {
        addEventListener('keydown', handleKeyPress)
        addEventListener('keyup', handleKeyRelease)
        return () => {
            removeEventListener('keydown', handleKeyPress)
            removeEventListener('keyup', handleKeyRelease)
        }
    }, [listing])

    useEffect(() => {
        if (commentsOpen || searchOpen) {
            setControlsShown(false)
        }
    }, [commentsOpen, searchOpen])

    function handleFetch(_page = page) {
        const url = `api.reddit.com/${searchType}${subreddit}.json?raw_json=1&count=25${_page ?? ""}`
        return new Promise((res) => {
            fetchData(url, d => {
                console.log(d)
                setListing(old => {
                    const result =  {
                        ...(_page.startsWith('&after') ? old : {}),
                        ...(d?.data?.children ?? []).reduce((acc, val) => ({
                            ...acc,
                            [val.data.name]: val.data
                        }), {}),
                    }
                    res(result)
                    return result
                })
            })
        })
    }

    function loadMore() {
        setPage(`&after=${items.at(-1)?.name ?? ''}`)
        handleFetch()
    }
    function handleScrollH(event) {
        const {scrollLeft, clientWidth, scrollWidth} = event.target
        
        if (scrollLeft + clientWidth >= scrollWidth - 2) {
            loadMore()
        }
    }

    useEffect(() => {
        setPage('')
        setListing([])
        handleFetch('').then(data => {
            const nt = listingToItems(data)
            console.log('nt', nt, data)
            setCurrentPost(nt[0])
        })
    }, [subreddit, searchType, searchSafe])
    
    useEffect(() => {
        handleFetch()
    }, [page])

    return (
        <div className={st`PostsPanel`}>
            {['left', 'right', 'bottom', 'top'].map(side => (
                <div
                    key={side}
                    className={
                        st`edges` + 
                        st`${side}` +
                        (controlsShown ? st`shown` : '')
                    }
                    onMouseEnter={event => {
                        console.log('entered ' + side + ' side')
                        setControlsShown(true)
                    }}
                >
                </div>
            ))}

            <FloatingPanel 
                panelOpen={searchOpen} 
                setPanelOpen={setSearchOpen} 
                controlsShown={controlsShown} 
                setControlsShown={setControlsShown} 
                extraStyle={undefined}
            >
                <SearchPanel 
                    opened={searchOpen} 
                    setOpened={setSearchOpen} 
                    {...{
                        searchType, setSearchType,
                        searchSafe, setSearchSafe,
                        subreddit, setSubreddit
                    }}            
                />
            </FloatingPanel>

            <FloatingPanel 
                panelOpen={commentsOpen} 
                setPanelOpen={setCommentsOpen} 
                controlsShown={controlsShown} 
                setControlsShown={setControlsShown} 
                side='right'
                label='Comments'
            >
                <CommentsPanel 
                    permalink={currentPost?.permalink} 
                    setRef={undefined}                
                />
            </FloatingPanel>

            <Post
                item={currentPost}
                refFunc={div => postRef.current = div}
                className={
                    (fitHeight ? st`fit-height` : '') + 
                    (controlsShown ? st`shown` : '')
                }
                extra={{
                    onMouseEnter: () => setControlsShown(false)
                }}
            />

            <GalleryControls 
                {...{
                    controlsShown, setControlsShown, handleScrollH, 
                    thumbnailContainerRef, items, currentPost, setCurrentPost, 
                    nextPost, previousPost, fitHeight, setFitHeight, setCurrentThumbnail
                }}         
            />

            {/* {currentPost && <div 
                className={st`gallery-controls` + (controlsShown ? st`shown` : '')}
                onMouseEnter={() => setControlsShown(true)}
            >
                <div 
                    className={st`thumbnails-container`}
                    onScroll={handleScrollH}
                    ref={thumbnailContainerRef}
                >
                    {items.map(item => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            className={item.id === currentPost.id ? st`current` : ''}
                            src={item.thumbnail}
                            alt=''
                            key={item.id}
                            onClick={() => setCurrentPost(item)}
                            ref={el => {
                                if (item.id === currentPost.id) {
                                    const thumb = thumbnailContainerRef.current
                                    if (!thumb || !el) {return}
                                    const destination = Math.max(
                                        Math.min(thumb.scrollLeft, el.offsetLeft),
                                        el.offsetLeft - thumb.clientWidth + el.clientWidth + 8
                                    )
                                    thumb.scrollTo({
                                        left: destination
                                    })
                                }
                            }}
                        />
                    ))}
                </div>
                
                <div className={st`controls-container`}>
                    <button
                        onClick={previousPost}
                        >Prev</button>
                    <button>Play</button>
                    <button
                        onClick={nextPost}
                    >Next</button>

                    <button
                        onClick={() => setFitHeight(old => !old)}
                    >{fitHeight ? 'Clamp width' : 'Clamp Height'}</button>
                </div>
            </div>} */}
        </div>
    )
}

function GalleryControls({
    controlsShown, setControlsShown,
    handleScrollH, thumbnailContainerRef,
    items, currentPost, setCurrentPost,
    nextPost, previousPost, fitHeight, setFitHeight, setCurrentThumbnail
}) {
    return (
        <div 
            className={st`gallery-controls` + (controlsShown ? st`shown` : '')}
            onMouseEnter={() => setControlsShown(true)}
        >
            <div 
                className={st`thumbnails-container`}
                onScroll={handleScrollH}
                ref={thumbnailContainerRef}
            >
                {items.map(item => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        className={item.id === currentPost.id ? st`current` : ''}
                        src={item.thumbnail}
                        alt=''
                        key={item.id}
                        onClick={() => setCurrentPost(item)}
                        ref={el => {
                            if (item.id === currentPost.id) {
                                setCurrentThumbnail?.(el)
                            }
                        }}
                        // ref={el => {
                            
                        //     if (item.id === currentPost.id) {
                        //         const thumb = thumbnailContainerRef.current
                        //         if (!thumb || !el) {return}
                        //         const destination = Math.max(
                        //             Math.min(thumb.scrollLeft, el.offsetLeft),
                        //             el.offsetLeft - thumb.clientWidth + el.clientWidth + 8
                        //         )
                        //         thumb.scrollTo({
                        //             left: destination
                        //         })
                        //     }
                        // }}
                    />
                ))}
            </div>
            
            <div className={st`controls-container`}>
                <button
                    onClick={previousPost}
                    >Prev</button>
                <button>Play</button>
                <button
                    onClick={nextPost}
                >Next</button>

                <button
                    onClick={() => setFitHeight(old => !old)}
                >{fitHeight ? 'Clamp width' : 'Clamp Height'}</button>
            </div>
        </div>
    )
}


function FloatingPanel({
    panelOpen, setPanelOpen,
    controlsShown, setControlsShown,
    side = 'left', label = 'Search',
    extraStyle = {}, className = '', children
}) {
    return (
        <div 
            className={
                st`floating-panel` +
                st`${side}` + 
                (panelOpen ? st`open` : st`closed`) + 
                className
            }
            style={{...extraStyle,}}
        >
            <div 
                className={st`bg-modal`}
                onClick={() => setPanelOpen(false)}
            />
            <div
                className={
                    st`edges` + 
                    st`${side}` +
                    (controlsShown ? st`shown` : '') +
                    (panelOpen ? st`open` : '')
                }
                onMouseEnter={event => {
                    !panelOpen && setControlsShown(true)
                }}
            >
                <div 
                    className={st`clickable-edge`}
                    onClick={() => {
                        setPanelOpen(true)
                        // setControlsShown(false)
                    }}
                > {label} </div>
            </div>
            <div className={st`content-container`}>
                {children}
            </div>
        </div>
    )
}

function Post({item, className='', extra={}, refFunc = (el) => {}, handlePostClick = (item, event) => {}}) {
    const focusEl = useRef<any>(null)
    useEffect(() => {
        focusEl.current?.focus()
    }, [focusEl])
    
    if (!item) {return <></>}
    return ( 
        <div 
            className={st`Post` + className} 
            key={item.name} 
            onClick={(e) => handlePostClick?.(item, e)} 
            id='PostsMiniMapScrollContainer' 
            {...extra}
        > 
            <div className={st`post-header`}>
                <h3>{item.title}</h3>
                <div>{`u/${item.author}`}</div>
            </div>

            <div 
                className={styles.Content} 
                ref={refFunc} 
            >
                {parse(item.selftext_html ?? '')}

                {item.media_embed?.content && 
                    <div className={st`MediaEmbed`}>
                        {parse(item.media_embed?.content ?? '')}
                    </div> 
                }

                {item.secure_media?.reddit_video?.fallback_url && 
                    <div className={styles.videoPlayer}>
                        <video
                            src={item.secure_media?.reddit_video?.fallback_url}
                            controls
                            autoPlay={true}
                            loop={true}
                            ref={focusEl}
                            onLoadedData={event => event.currentTarget.focus()}
                            // autoPlay
                        />
                    </div>
                }

                {item.media_metadata &&
                    <ImageGallery
                        items={Object.entries(item.media_metadata).map((entry: any[]) => {
                            const url = `https://i.redd.it/${entry[0]}.${entry[1].m.replace('image/', '')}`
                            return {
                                original: url,
                                thumbnail: url,
                            }
                        })}
                        thumbnailPosition='left'
                    />
                }

                {(() => {
                    switch (item.post_hint) {
                        case 'image': 
                            return <img
                                className='post-image'
                                src={item.url ?? ''}
                                alt=''
                            />
                        case 'link':
                            return <>
                                {item.url.endsWith('.gifv') 
                                ? 
                                    <video
                                        src={item.url.replace('.gifv', '.mp4')}
                                        controls
                                        autoPlay={true}
                                        loop={true}
                                    />
                                :
                                <a
                                    className={styles.link}
                                    href={item.url}
                                    style={{
                                        maxWidth: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                    }}
                                >
                                    <img
                                        src={(item.preview?.images[0]?.source?.url ?? '').replaceAll('amp;', '') || ''}
                                        width={100}
                                        height={100}
                                        alt='preview'
                                    />
                
                                    <h4>
                                        {item.url}
                                    </h4>
                                </a>
                                }
                            </>
                        default: 
                            return []
                    }
                })()}
            </div>

        </div>
    )
}
