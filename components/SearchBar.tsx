import {useState} from "react";
import SearchPanel from "./Panels/SearchPanel";

export default function SearchBar({searchType, setSearchType, setSubreddit, subreddit}) {
    const [open, setOpen] = useState(false)
    
    return (
        <div className='input-container'>
            <select 
                name='type' 
                id='type'
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
                {['r/', 'u/'].map(option => <option key={option} value={option}>{option}</option>)}
            </select>

            <input
                onChange={(e) => setSubreddit(e.target.value)}
                value={subreddit}
            />
            
            {/* <SearchPanel 
                searchInput={searchInput} 
                searchType={searchType} 
                searchSafe={true} 
                setSubreddit={setSubreddit}
            /> */}
        </div>
    )
}