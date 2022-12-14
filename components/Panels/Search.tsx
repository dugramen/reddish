import React from "react";
import searchStyle from '../../styles/Search.module.scss';
import listingStyle from '../../styles/Listing.module.scss';
import EntryPost from "../entries/EntryPost";
import Listing from "../Listing";

import { fetchData } from "../utils";

export default function Search({setSubreddit, setPrefix, setCurrentPost, listingComponent, setIsListingVisible}) {
    const [inputVal, setInputVal] = React.useState('')
    const [searchResults, setSearchResults] = React.useState<any>()
    const [list, setList] = React.useState<any>({})
    const [page, setPage] = React.useState<any>(null)
    const [type, setType] = React.useState<any>(null)
    const [current, setCurrent] = React.useState<any>(null)
    const [safeSearch, setSafeSearch] = React.useState(true)

    const st = {...listingStyle, ...searchStyle}

    const handleSetSubreddit = (value) => setSubreddit(
        type==='sr'
        ? value?.data?.display_name
        : type === 'user'
            ? value?.data?.name
            : value?.data?.title
    )

    const urlFormatter = (page) => {
        const pageQuery = (page && `&${page}`) ?? ''
        const typeQuery = type === null ? '' : `&type=${type}`
        const safeQuery = safeSearch === false ? '&include_over_18=1' : ''
        return `https://www.reddit.com/search/.json?q=${inputVal}${pageQuery}${typeQuery}${safeQuery}&raw_json=1`
    }

    function handleFetch(page, list) {
        const url = urlFormatter(page)
        fetchData(url, (data: any) => {
            setSearchResults(data)
            // setList({...list, ...(data?.data?.children.reduce((accum, val) => {}, {}))})
            setList(data?.data?.children?.reduce((accum, val) => ({...accum, [val?.data?.permalink ?? val?.data?.id]: val}), list) ?? {})
        })
    }

    React.useEffect(() => {
        setIsListingVisible(type !== null)
    }, [type])

    React.useEffect(() => {
        type===null && Object.keys(list).length > 0 && current && (() => {
            setCurrentPost(list?.[current]?.data)
        })()
    }, [type, current])

    // These are for refreshing listings
    React.useEffect(() => {
        handleFetch(page, list)
    }, [page])
    React.useEffect(() => {
        setList([])
        setPage(null)
        handleFetch(null, [])
    }, [inputVal, type, safeSearch])

    return (
    <div className={st.SearchPanel}>
        <input 
            value={inputVal} 
            onChange={(e) => setInputVal(e.target.value)} 
            placeholder="Search"
            // onSubmit={} 
        />

        <div>
            <button
                onClick={e => setType('sr')}
                className={`${st.searchType} ${type === 'sr' && st.currentButton}`}
                >
                Subreddit
            </button>

            <button
                onClick={e => setType('user')}
                className={`${st.searchType} ${type === 'user' && st.currentButton}`}
                >
                User
            </button>

            <button
                onClick={e => setType(null)}
                className={`${st.searchType} ${type === null && st.currentButton}`}
            >
                Post
            </button>

            <label className="safe-search">
                <input
                    type={'checkbox'}
                    checked={safeSearch}
                    onChange={e => setSafeSearch(e.target.checked)}
                    style={{whiteSpace: 'nowrap'}}
                />
                Safe Search
            </label>
        </div>

        {
            <Listing 
                // dataLength={undefined} 
                next={() => setPage(`after=${searchResults?.data?.after}`)} 
                sourceUrl={urlFormatter('')}    
                id='SearchPanelListing'        
            >
                {Object.entries(list).map(([key, value]: any) => {
                    if (type===null) {
                        return <EntryPost 
                            key={key}
                            post={value} 
                            isCurrent={key===current} 
                            setCurrentPost={(val) => {
                                setCurrentPost(val?.data ?? '')
                                // handleSetSubreddit(val)
                                console.log(val)
                            }} 
                            postType={'r/'}                       
                        />
                    }

                    return <div 
                        key={key}
                        className={`${st.article} ${key === current && st.current}`}
                        onClick={() => {
                            setCurrent(key)
                            
                            setPrefix(type==='sr'? 'r/' : 'u/')
                            handleSetSubreddit(value)
                        }}
                    >
                        <img
                            src={
                                type === 'sr'
                                ? value?.data?.community_icon === ''
                                    ? value?.data?.header_img
                                    : value?.data?.community_icon
                                : type === 'user'
                                    ? value?.data?.icon_img
                                    : ''
                            }
                            alt={' '}
                            width={24}
                            height={24}
                        />
                        {
                        type==='sr'
                        ? value?.data?.display_name
                        : type === 'user'
                            ? value?.data?.name
                            : value?.data?.title
                        }
                    </div>
                })}
            </Listing>
        }
    </div>
    )
}