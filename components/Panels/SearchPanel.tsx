import { useState, useEffect, useRef, useContext } from 'react';
import styles from '../../styles/SearchPanel.module.scss'; 
import { ImageLoaded, fetchAuth, fetchData } from '../utils';
import Image from 'next/image';
import Login from '../Login';
import { AuthContext } from '../../pages';

export default function SearchPanel({
    opened, setOpened,
    searchType, setSearchType,
    searchSafe, setSearchSafe,
    subreddit, setSubreddit,
}) {

    // const [opened, setOpened] = useState(false)
    const [page, setPage] = useState('')
    const [listing, setListing] = useState<any>({})
    const [searchInput, setSearchInput] = useState('')
    const [localSearch, setLocalSearch] = useState('')
    const items: any[] = Object.values(listing)

    const scrollRef = useRef<HTMLDivElement>(null)
    const myStuff = searchType.startsWith('my-')
    
    const authenticated = useContext(AuthContext)

    function handleFetch() {
        const pageQuery = page
        const typeQuery = `&type=${{'r/': 'sr', 'u/': 'user'}[searchType] ?? ''}`
        const safeQuery = searchSafe === false ? '&include_over_18=1' : ''
        let url = `https://api.reddit.com/search?q=${searchInput}${pageQuery}${typeQuery}${safeQuery}&raw_json=1`
        console.log(url)
        fetchData(url, handleFetchedData)
        //     , d => {
        //     console.log(d)
        //     setListing(old => ({
        //         ...(page.startsWith('&after') ? old : {}),
        //         ...(d?.data?.children ?? []).reduce((acc, val) => ({
        //             ...acc,
        //             [val.data.id]: val.data
        //         }), {}),
        //     }))
        // })
    }

    function handleFetchedData(d) {
        console.log(d)
        setListing(old => ({
            ...(page.startsWith('&after') ? old : {}),
            ...(d?.data?.children ?? []).reduce((acc, val) => ({
                ...acc,
                [val.data.id]: val.data
            }), {}),
        }))
    }

    function handleScroll(event) {
        if (!scrollRef.current) {return}
        const {scrollTop, clientHeight, scrollHeight, scrollTo} = scrollRef.current
        
        if (scrollTop + clientHeight >= scrollHeight - 2) {
            setPage(`&after=${items.at(-1)?.name ?? ''}`)
        }
    }

    // useEffect(() => {
    //     fetchAuth('https://oauth.reddit.com/subreddits/mine/subscriber?limit=100')
    //     .then(res => {
    //         console.log('juice -> ', res)
    //         return res.json()
    //     })
    //     .then(data => console.log('subs -> ', data))
    //     .catch(a => console.log('failur -> ', a))
    // }, [])

    useEffect(() => {
        setPage('')
        setListing([])
    }, [searchInput, searchType, searchSafe])

    useEffect(() => {
        if (myStuff) {
            fetchAuth('https://oauth.reddit.com/subreddits/mine/subscriber?limit=100')
            .then(res => res.json())
            .then(handleFetchedData)
            .catch(console.log)
        } else {
            handleFetch()
        }
    }, [searchInput, searchType, searchSafe, page])

    return (
        <div className={styles.SearchPanel + ' SearchPanel'}>

            <Login></Login>
            
            <div className={styles.InputsContainer}>
                <select onChange={event => setSearchType(event.target.value)}>
                    <option value='r/'>{'subreddit'}</option>
                    <option value='u/'>{'user'}</option>
                    <option value='post'>{'post'}</option>
                    {authenticated && <>
                        <option value='my-r/'>{'my subreddits'}</option>
                    </>}
                </select>

                {myStuff ? (
                    <input
                        type='search'
                        placeholder='Filter'
                        onChange={event => setLocalSearch(event.target.value)}
                    />
                ) : (
                    <input
                        type='search'
                        placeholder='Search'
                        onChange={event => setSearchInput(event.target.value)}
                    />
                )}
            </div>

            <div 
                className={`${styles.ItemsContainer}  ${(opened ? styles.Opened : styles.Closed)}`} 
                onScroll={handleScroll} 
                ref={scrollRef}
                onMouseEnter={() => setOpened(true)}
                // onMouseLeave={() => setOpened(false)}
            >
                {(myStuff 
                    ? items.filter(item => item.display_name.toLowerCase().includes(localSearch)) 
                    // ? items
                    : items
                ).map((item: any, index) => (
                    <div 
                        key={item.id ?? index} 
                        className={styles.Item} 
                        onClick={() => {
                            setSubreddit(item.display_name || item.name)
                            setOpened(false)
                        }}
                    >
                        <ImageLoaded
                            src={
                                item.community_icon || 
                                item.header_img ||
                                item.icon_img ||
                                item.thumbnail ||
                                ''
                            }
                            alt=''
                            width={50}
                            height={50}
                        />
                        <div className={styles.Title}>{item.display_name_prefixed || item.title || `u/${item.name}`}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}