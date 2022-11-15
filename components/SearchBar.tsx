import React from "react";

export default function SearchBar({searchType, setSearchType, setSubreddit, subreddit}) {
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
    </div>
    )
}