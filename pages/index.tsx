import React, { useState } from "react";
import styles from "../styles/Home.module.scss";
import PostsPanel from "../components/Panels/PostsPanel";
import { fetchAuth, fetchData } from "../components/utils";
// import { getCookie, setCookie } from "cookies-next";
// import { getAccessTokenFromCode, getToken } from "../components/Login";

export default function Home(props) {

    // console.log('access ', props.access_token)

    const [searchType, setSearchType] = React.useState("r/");
    const [search, setSearch] = React.useState("");
    const [subreddit, setSubreddit] = React.useState("");

    // React.useEffect(() => {
    //     console.log({ search, searchType });
    // }, [search, searchType]);

    React.useEffect(() => {
        fetchAuth('https://oauth.reddit.com/api/v1/me')
        .then(res => res.json())
        .then(console.log)
        .catch(console.log)
        // fetchData('https://oauth.reddit.com/api/v1/me', a => {
        //     console.log('a - ', a)
        // })
        // fetch('/api/reddit?url=' + encodeURIComponent('https://oauth.reddit.com/api/v1/me'))
        // .then(a => console.log('22 - ', a))
        // // .then(console.log)
        // .catch(a => console.log('24 - ', a))
    }, [])

    return (
        <div className={styles.page}>

            <PostsPanel 
                subreddit={subreddit}
                searchSafe={false}                
            />

        </div>
    );
}



