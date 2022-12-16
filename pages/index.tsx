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
    setCurrentPost={(val) => {setCurrentPost(val); setCurrentPanel(2)}}      
    currentPost={currentPost}
    searchType={searchType} 
    setSearchType={setSearchType} 
    setSubreddit={setSubreddit} 
    subreddit={subreddit}
    name={searchType === 'u/' ? 'User' : 'Subreddit'}
  />

  return (
    <div className={styles.page}>

      <SplitPanel 
        currentPanel={currentPanel} 
        setCurrentPanel={setCurrentPanel}        
      >
        <Search 
          setSubreddit={(val) => {setSubreddit(val); setCurrentPanel(1)}}
          setPrefix={setSearchType}
          setCurrentPost={(val) => {setCurrentPost(val); setCurrentPanel(isListingVisible ? 2 : 1)}}
          listingComponent={ListingComponent}
          setIsListingVisible={setIsListingVisible}
          name="Search"
        />

        { isListingVisible && ListingComponent }
        
        { currentPost && 
          <Post
            currentPost={currentPost}
            setCurrentPost={setCurrentPost}
            name="Post"
          />
        }

        { currentPost && 
          <CommentsPanel 
            permalink={currentPost?.permalink}
            name="Comments" 
          />
        }
      </SplitPanel>
      
    </div>
  )
}
