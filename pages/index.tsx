import React, { useState } from "react";
import styles from "../styles/Home.module.scss";
import Post from "../components/Panels/Post";
import ListingPanel from "../components/Panels/ListingPanel";
import SearchBar from "../components/SearchBar";
import { fetchData } from "../components/utils";
import Search from "../components/Panels/Search";
import CommentsPanel from "../components/Panels/CommentsPanel";
import SplitPanel from "../components/reusable/SplitPanel";
import SearchPanel from "../components/Panels/SearchPanel";
import PostsPanel from "../components/Panels/PostsPanel";

export default function Home() {
    const [searchOpened, setSearchOpened] = useState(false)

    const [searchType, setSearchType] = React.useState("r/");
    const [search, setSearch] = React.useState("");
    const [subreddit, setSubreddit] = React.useState("");
    let [page, setPage] = React.useState<string | null>(null);

    React.useEffect(() => {
        console.log({ search, searchType });
    }, [search, searchType]);

    const [panels, setPanels] = React.useState([]);
    const [currentPanel, setCurrentPanel] = React.useState(0);


    const [listing, setListing] = React.useState<any>({});
    const [isListingVisible, setIsListingVisible] = React.useState(true);
    const [posts, setPosts] = React.useState({});

    const [currentPost, setCurrentPost] = React.useState<any>(null);

    // function getNewListing(
    //     searchType: any,
    //     subreddit: any,
    //     page: any,
    //     p = posts
    // ) {
    //     setListing([]);
    //     fetchData(
    //         `https://api.reddit.com/${searchType}${subreddit}.json?raw_json=1&count=25${page ?? ""}`,
    //         (data) => {
    //             setListing(data);
    //             data?.data?.children &&
    //                 setPosts((old) => {
    //                     const newVal = data?.data?.children.reduce(
    //                         (accum: any, val: any) => ({
    //                             ...accum,
    //                             [val.data.permalink]: val,
    //                         }),
    //                         p
    //                     );
    //                     console.log({ newVal });
    //                     return newVal ?? old;
    //                 });
    //         }
    //     );
    // }

    // React.useEffect(() => {
    //     setPosts({});
    //     setPage(null);
    //     getNewListing(searchType, subreddit, null, {});
    // }, [subreddit, searchType]);

    // React.useEffect(() => {
    //     getNewListing(searchType, subreddit, page, posts);
    // }, [page]);

    const ListingComponent = (
        <ListingPanel
            listing={listing}
            posts={posts}
            setPage={setPage}
            setCurrentPost={(val) => {
                setCurrentPost(val);
                setCurrentPanel(2);
            }} 
            currentPost={currentPost}
            searchType={searchType}
            setSearchType={setSearchType}
            setSubreddit={setSubreddit}
            subreddit={subreddit}
            name={searchType === "u/" ? "User" : "Subreddit"}
        />
    );

    const searchOptionMap = [
        ["Sub", "r/"],
        ["User", "u/"],
        ["Post", ""],
    ];

    return (
        <div className={styles.page}>
            {/* <div 
                className="Header" 
                onMouseEnter={() => setSearchOpened(true)}
                onMouseLeave={() => setSearchOpened(false)}
            >

                <div className="input-container">
                    <select
                        className="search-type"
                        onChange={(e) => {
                            const eef = searchOptionMap[parseInt(e.target.value)][1];
                            console.log(eef);
                            setSearchType(eef ?? "");
                        }}
                    >
                        {searchOptionMap.map(([label, condition], index) => (
                            <option key={label} value={index}>
                                {label}
                            </option>
                        ))}
                    </select>

                    <input
                        type="search"
                        className="search-bar"
                        placeholder="Search"
                        value={search ?? ""}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

            </div> */}

            <PostsPanel 
                subreddit={subreddit} 
                // searchType={searchType} 
                searchSafe={false}                
            />


        </div>
    );
}
