import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import styles from "../styles/Home.module.css"
import { AppShell, MantineProvider, ColorSchemeProvider, Navbar, Header, Tabs } from "@mantine/core"
import "@rainbow-me/rainbowkit/styles.css"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { useSigner } from "wagmi"
import { ethers } from "ethers"
import { nftTableName, postTableName, sigmatorAbi, sigmatorContractAddress } from "../constants"
import Posts from "../components/Posts"
import NFTs from "../components/NFTs"
import { IconMessageCircle, IconPhoto, IconNote } from "@tabler/icons"

export default function Home() {
    const { isConnected } = useAccount()
    const router = useRouter()
    const { data: signer, isError, isLoading } = useSigner()

    const [posts, setPosts] = useState([])
    const [nfts, setNfts] = useState([])

    useEffect(() => {
        fetchPosts()
        fetchNFTs()
    }, [])

    const fetchPosts = async () => {
        // const postsData = await fetch("https://testnet.tableland.network/query?s=" + "SELECT * FROM " + postTableName + " LIMIT 10")
        const postsData = await fetch(
            "https://testnet.tableland.network/query?s=" + "SELECT * FROM " + postTableName
        )
        const postsDataJson = await postsData.json()
        console.log("postsDataJson", postsDataJson)
        setPosts(postsDataJson)
        console.log("fetching posts")
    }

    const fetchNFTs = async () => {
        const nftsData = await fetch(
            "https://testnet.tableland.network/query?s=" + "SELECT * FROM " + nftTableName
        )
        const nftsDataJson = await nftsData.json()
        console.log("nftsDataJson", nftsDataJson)
        setNfts(nftsDataJson)
        console.log("fetching nfts")
    }

    return (
        <div className={styles.container}>
            <Tabs variant="pills" defaultValue="posts">
                <Tabs.List>
                    <Tabs.Tab value="posts" icon={<IconNote size={14} />}>
                        Posts
                    </Tabs.Tab>
                    <Tabs.Tab value="nfts" icon={<IconPhoto size={14} />}>
                        NFTs
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="posts" pt="xs">
                    <Posts posts={posts} />
                </Tabs.Panel>

                <Tabs.Panel value="nfts" pt="xs">
                    <NFTs nfts={nfts} />
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}
