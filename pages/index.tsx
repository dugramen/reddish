import { useState, useEffect, createContext } from "react";
import styles from "../styles/Home.module.scss";
import PostsPanel from "../components/Panels/PostsPanel";
import { fetchAuth, fetchData } from "../components/utils";
import { hasCookie, getCookies } from "cookies-next";
// import { getAccessTokenFromCode, getToken } from "../components/Login";

export const AuthContext = createContext(false)

export default function Home(props) {

    // console.log('access ', props.access_token)

    // const [searchType, setSearchType] = React.useState("r/");
    // const [search, setSearch] = React.useState("");
    // const [subreddit, setSubreddit] = React.useState("");

    // React.useEffect(() => {
    //     console.log({ search, searchType });
    // }, [search, searchType]);

    useEffect(() => {
        fetchAuth('https://oauth.reddit.com/api/v1/me')
        .then(res => res.json())
        .then(console.log)
        .catch(console.log)
    }, [])

    console.log('29 - ', props)


    return (
        <div className={styles.page}>
            <AuthContext.Provider value={props.authenticated}>
                <PostsPanel 
                    // subreddit={subreddit}
                    searchSafe={false}                
                />
            </AuthContext.Provider>
        </div>
    );
}

export function getServerSideProps({req, res}) {
    const token = hasCookie('access_token', {req, res})
    console.log('me run ', getCookies({req, res}))
    return {
        props: {
            authenticated: token ? true : false
        }
    }
}

