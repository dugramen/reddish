import React from "react";
import searchStyle from '../../styles/Search.module.scss';
import listingStyle from '../../styles/Listing.module.scss';
import EntryPost from "../entries/EntryPost";
import Listing from "../Listing";
import Image from "next/image";

import { fetchData } from "../utils";
import { convertToObject } from "typescript";

// interface Props {
//     setSubreddit, setPrefix, setCurrentPost, listingComponent, setIsListingVisible,
//     [a: string | symbol | number]: any,
// }

export default function Search({search, type, setSubreddit, setPrefix, setCurrentPost, listingComponent, setIsListingVisible, name}) {
    // const [inputVal, setInputVal] = React.useState('')
    const [searchResults, setSearchResults] = React.useState<any>()
    const [list, setList] = React.useState<any>({})
    const [page, setPage] = React.useState<any>('')
    // const [type, setType] = React.useState<any>(null)
    const [current, setCurrent] = React.useState<any>(null)
    const [safeSearch, setSafeSearch] = React.useState(true)

    const st = {...listingStyle, ...searchStyle}

    const handleSetSubreddit = (value) => setSubreddit(
        type==='r/'
        ? value?.data?.display_name
        : type === 'u/'
            ? value?.data?.name
            : value?.data?.title
    )

    const urlFormatter = (p) => {
        const pageQuery = p
        // const typeQuery = type === '' ? '' : `&type=${type}`
        const typeQuery = `&type=${{'r/': 'sr', 'u/': 'user'}[type] ?? ''}`
        const safeQuery = safeSearch === false ? '&include_over_18=1' : ''
        const url = `https://www.reddit.com/search/.json?q=${search}${pageQuery}${typeQuery}${safeQuery}&raw_json=1`
        // console.log(url)
        return url
    }

    function handleFetch(p) {
        const url = urlFormatter(p)
        console.log(url)
        fetchData(url, (data: any) => {
            setSearchResults(data)
            setList(old => data?.data?.children ?? old)
            console.log(data)
            // setList(data?.data?.children?.reduce((accum, val) => ({...accum, [val?.data?.permalink ?? val?.data?.id]: val}), list) ?? {})
        })
    }

    React.useEffect(() => {
        setIsListingVisible(type !== null)
    }, [type])

    // These are for refreshing listings
    React.useEffect(() => {
        handleFetch(page)
    }, [page])

    React.useEffect(() => {
        // setList([])
        setPage('')
        handleFetch(null)
        console.log(type)
    }, [search, type, safeSearch])

    const searchOptionMap = [
        ['Sub', 'sr'],
        ['User', 'user'],
        ['Post', null]
    ]

    return (
    <div className={st.SearchPanel + ' PanelSection ' + (search === '' ? st.empty : '')} id='Search'>
        {
            <Listing 
                // dataLength={undefined} 
                next={() => setPage(`&after=${searchResults?.data?.after}`)} 
                sourceUrl={urlFormatter('')}    
                id='SearchPanelListing'        
            >
                {Object.entries(list).map(([key, value]: any) => {
                    const data = value.data ?? {}
                    // console.log(data)
                    if (type===null) {
                        return <EntryPost 
                            key={key}
                            post={value} 
                            isCurrent={key===current} 
                            setCurrentPost={(val) => {
                                setCurrentPost(val?.data ?? '')
                                // handleSetSubreddit(val)
                                // console.log(val)
                            }} 
                            postType={'r/'}                       
                        />
                    }
                    const imgSrc = (
                        value?.data?.community_icon ||
                        value?.data?.header_img ||
                        value?.data?.icon_img ||
                        data.thumbnail ||
                        ''
                    )

                    return <div 
                        key={key}
                        className={`${st.article} ${key === current && st.current} panel-listing-container`}
                        onClick={() => {
                            setCurrent(key)
                            setPrefix(type)
                            handleSetSubreddit(value)
                        }}
                    >
                        <Image
                            loader={() => imgSrc}
                            unoptimized={true}
                            src={imgSrc}
                            alt={' '}
                            width={24}
                            height={24}
                        />

                        <div className="hover-label">
                            {
                                value?.data?.display_name ||
                                value?.data?.title ||
                                value?.data?.name || 
                                'wofnionivmriv'
                            }
                        </div>

                        {/* {
                            type==='sr'
                            ? value?.data?.display_name
                            : type === 'user'
                                ? value?.data?.name
                                : value?.data?.title
                        } */}
                    </div>
                })}
            </Listing>
        }
    </div>
    )
}