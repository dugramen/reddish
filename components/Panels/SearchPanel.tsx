import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/SearchPanel.module.scss'; 
import { ImageLoaded, fetchData } from '../utils';
import Image from 'next/image';

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
    const items: any[] = Object.values(listing)

    const scrollRef = useRef<HTMLDivElement>(null)

    function handleFetch() {
        const pageQuery = page
        const typeQuery = `&type=${{'r/': 'sr', 'u/': 'user'}[searchType] ?? ''}`
        const safeQuery = searchSafe === false ? '&include_over_18=1' : ''
        const url = `www.reddit.com/search/.json?q=${searchInput}${pageQuery}${typeQuery}${safeQuery}&raw_json=1`
        console.log(url)
        fetchData(url, d => {
            console.log(d)
            setListing(old => ({
                ...(page.startsWith('&after') ? old : {}),
                ...(d?.data?.children ?? []).reduce((acc, val) => ({
                    ...acc,
                    [val.data.id]: val.data
                }), {}),
            }))
        })
    }

    function handleScroll(event) {
        if (!scrollRef.current) {return}
        const {scrollTop, clientHeight, scrollHeight, scrollTo} = scrollRef.current
        
        if (scrollTop + clientHeight >= scrollHeight - 2) {
            setPage(`&after=${items.at(-1)?.name ?? ''}`)
        }
    }

    useEffect(() => {
        setPage('')
        setListing([])
    }, [searchInput, searchType, searchSafe])

    useEffect(() => {
        handleFetch()
    }, [searchInput, searchType, searchSafe, page])

    return (
        <div className={styles.SearchPanel + ' SearchPanel'}>
            
            <div className={styles.InputsContainer}>
                <select onChange={event => setSearchType(event.target.value)}>
                    <option value='r/'>{'subreddit'}</option>
                    <option value='u/'>{'user'}</option>
                    <option value='post'>{'post'}</option>
                </select>
                <input
                    type='search'
                    placeholder='Search'
                    onChange={event => setSearchInput(event.target.value)}
                />
            </div>

            <div 
                className={`${styles.ItemsContainer}  ${(opened ? styles.Opened : styles.Closed)}`} 
                onScroll={handleScroll} 
                ref={scrollRef}
                onMouseEnter={() => setOpened(true)}
                // onMouseLeave={() => setOpened(false)}
            >
                {items.map((item: any, index) => (
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