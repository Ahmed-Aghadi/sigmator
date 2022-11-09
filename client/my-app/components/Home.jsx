import React, { useEffect, useState } from "react"
// import PostCard from "../components/PostCard"
// import Posts from "./Posts"

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     fetchPosts()
    // }, [])

    const fetchPosts = async () => {
        console.log("fetching posts")
        // console.log("posts", posts)
        // setPosts(posts)
    }
    return (
        <>
            {/* <Posts posts={posts} /> */}
            <p>home</p>
        </>
    )
}

export default Home
