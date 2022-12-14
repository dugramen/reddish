import React from 'react'
import styles from '../styles/Home.module.scss'
import Post from '../components/Panels/Post'
import ListingPanel from '../components/Panels/ListingPanel'
import SearchBar from '../components/SearchBar'
import { fetchData } from '../components/utils'
import Search from '../components/Panels/Search'
import CommentsPanel from '../components/Panels/CommentsPanel'
import SplitPanel from '../components/reusable/SplitPanel'


export default function Home() {
  const [searchType, setSearchType] = React.useState('r/')
  const [subreddit, setSubreddit] = React.useState('')
  let [page, setPage] = React.useState<string | null>(null)
  
  const [panels, setPanels] = React.useState([]) 
  const [currentPanel, setCurrentPanel] = React.useState(0)

  const [listing, setListing] = React.useState<any>({})
  const [isListingVisible, setIsListingVisible] = React.useState(true)
  const [posts, setPosts] = React.useState({})

  const [currentPost, setCurrentPost] = React.useState<any>(null)
  // const [postData, setPostData] = React.useState(null)

  // function fetchData(url: string, setter: (a: any) => any) {
  //   fetch("http://localhost:5000/" + url)
  //     .then(res => {
  //       if (res.ok) {
  //         return res.json()
  //       }
  //       throw new Error('Something wrong')
  //     })
  //     .then(data => {
  //       console.log(data)
  //       setter(data)
  //     })
  //     .catch(error => {})
  // }

  function getNewListing(searchType:any, subreddit:any, page:any, p = posts) {
    setListing([])
    fetchData(`https://api.reddit.com/${searchType}${subreddit}.json?raw_json=1&count=25${page ?? ''}`, (data) => {
      setListing(data)
      data?.data?.children && setPosts(old => {
        const newVal = data?.data?.children.reduce((accum: any, val: any) => ({...accum, [val.data.permalink]: val}), p)
        console.log({newVal})
        return newVal ?? old
      })
    })
  }

  React.useEffect(() => {
    setPosts({})
    setPage(null)
    getNewListing(searchType, subreddit, null, {})
  }, [subreddit, searchType])

  React.useEffect(() => {
    getNewListing(searchType, subreddit, page, posts)
  }, [page])

  const ListingComponent = <ListingPanel 
    listing={listing} 
    posts={posts} 
    setPage={setPage} 
    setCurrentPost={setCurrentPost}      
    currentPost={currentPost}
    searchType={searchType} 
    setSearchType={setSearchType} 
    setSubreddit={setSubreddit} 
    subreddit={subreddit}
  />

  return (
    <div className={styles.page}>



      <SplitPanel>
        <Search 
          setSubreddit={setSubreddit}
          setPrefix={setSearchType}
          setCurrentPost={setCurrentPost}
          listingComponent={ListingComponent}
          setIsListingVisible={setIsListingVisible}
        />

        {isListingVisible && ListingComponent}
        
        { currentPost && 
        // <div className={`${styles.Panel}`} id='PostPanel'>
          <Post
            currentPost={currentPost}
            setCurrentPost={setCurrentPost}
          />
        // </div>
        }

        { currentPost && <CommentsPanel 
          permalink={currentPost?.permalink}        
        />}
      </SplitPanel>
      
    </div>
  )
}
