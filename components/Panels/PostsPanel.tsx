import {useState, useEffect, useRef, Children, memo} from 'react';
import styles from '../../styles/PostsPanel.module.scss';
import { ImageLoaded, fetchData } from '../utils';
import parse from 'html-react-parser';
import ReactPlayer from 'react-player';
import CommentsPanel from './CommentsPanel';
import anime from 'animejs/lib/anime.es.js';
import ImageGallery from 'react-image-gallery';
import { faL } from '@fortawesome/free-solid-svg-icons';

function st(strings, ...values) {
    const wholeString = strings.reduce((result, str, i) => {
      const value = values[i] !== undefined ? values[i] : '';
      return result + str + value;
    }, '');
  
    return styles[wholeString] + ' '
}

export default function PostsPanel({subreddit, searchType, searchSafe}) {
    const [currentPost, setCurrentPost] = useState<any>({})
    const [page, setPage] = useState('')
    const [listing, setListing] = useState<any>({})
    let items: any[] = Object.values(listing).map((item: any, index) => ({...item, index: index}))
    
    const [fitHeight, setFitHeight] = useState(true)
    const [controlsShown, setControlsShown] = useState(false)
    
    // const [minimapOpen, setMinimapOpen] = useState(false)
    // const [hoverSide, setHoverSide] = useState<'left' | 'right'>('left')
    // const [gridView, setGridView] = useState(false)
    // const [manualScrolling, setManualScrolling] = useState(false)
    // const [currentScrollSide, setCurrentScrollSide] = useState('left')

    // items = items.filter(item => item.media_metadata)

    const commentsRef = useRef<any>(null)
    const postRef = useRef<any>(null)
    const holdMap = useRef({})

    const previousPost = () => setCurrentPost(old => {
        console.log('preved ', items)
        return items[Math.max(old.index - 1, 0)]
    })
    const nextPost = () => setCurrentPost(old => {
        console.log('nexted ', items)
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

    // useKeyPress('ArrowLeft', a => a === 'down' && previousPost())
    // useKeyPress('ArrowRight', a => a === 'down' && nextPost())

    function handleFetch() {
        const url = `api.reddit.com/${searchType}${subreddit}.json?raw_json=1&count=25${page ?? ""}`
        fetchData(url, d => {
            console.log(d)
            // setListing(data)
            setListing(old => ({
                ...(page.startsWith('&after') ? old : {}),
                ...(d?.data?.children ?? []).reduce((acc, val) => ({
                    ...acc,
                    [val.data.name]: val.data
                }), {}),
            }))
        })
    }

    function loadMore() {
        console.log('more loading')
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
        setCurrentPost(items[0])
    }, [subreddit, searchType, searchSafe])

    useEffect(() => {
        handleFetch()
    }, [subreddit, searchType, searchSafe, page])

    return (
        <div className={st`PostsPanel`}>
            {['left', 'right', 'top', 'bottom'].map(side => (
                <div
                    key={side}
                    style={{
                        // background: 'red',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        minWidth: 32,
                        minHeight: 32,
                        zIndex: 2,
                        writingMode: 'vertical-rl',
                        // textOrientation: 'upright',
                        textAlign: 'center',
                        verticalAlign: 'center',
                        opacity: controlsShown ? 1 : 0,
                        transition: '.3s',
                        [side]: 'unset',
                    }}
                    onMouseEnter={event => {
                        console.log('entered ' + side + ' side')
                        setControlsShown(true)
                    }}
                >
                    {side === 'left' && 'Comments'}
                </div>
            ))}
            

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

            {currentPost && <div 
                className={st`gallery-controls` + (controlsShown ? st`shown` : '')}
                onMouseEnter={() => setControlsShown(true)}
            >
                <div 
                    className={st`thumbnails-container`}
                    onScroll={handleScrollH}
                >
                    {items.map(item => (
                        <img
                            className={item.id === currentPost.id ? st`current` : ''}
                            src={item.thumbnail}
                            alt=''
                            key={item.id}
                            // width={50}
                            // height={50}
                            onClick={() => setCurrentPost(item)}
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
            </div>}
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

                        {/* <ReactPlayer
                            url={item.secure_media?.reddit_video?.fallback_url} 
                            controls={true} 
                            // className={styles.videoPlayer} 
                            // muted={true} 
                            // playing={false} 
                        /> */}
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

function PostsContainer({items, postsRef, handleScroll, handlePostClick}) {
    return (
        <div className={st`PostsContainer`} onScroll={handleScroll}>
            {items.map((item, i) => ( 
                <Post
                    item={item}
                    key={item.id}
                    refFunc={el => postsRef.current[i] = el}
                />
            ))}
        </div>
    )
}