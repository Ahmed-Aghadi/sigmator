import "../styles/Home.module.css"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import styles from "../styles/Home.module.css"
import { AppShell, MantineProvider, ColorSchemeProvider, Navbar, Header } from "@mantine/core"
import { NavbarMinimal } from "../components/Navigation"
import Main from "../components/Main"
import { useLocalStorage } from "@mantine/hooks"
import { ConnectButton, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { chain, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { useAccount } from "wagmi"
import { useEffect } from "react"
import { useSigner } from "wagmi"
import { ethers } from "ethers"
import {
    sigmatorAbi,
    sigmatorClimateNFTAbi,
    sigmatorClimateNFTContractAddress,
    sigmatorContractAddress,
} from "../constants"

export default function Home() {
    const { isConnected } = useAccount()
    const router = useRouter()
    const { data: signer, isError, isLoading } = useSigner()
    useEffect(() => {
        if (signer) {
            fetchTableName()
        }
    }, [signer])

    const fetchTableName = async () => {
        console.log("fetching posts")
        console.log("signer", signer)
        const contractInstance = new ethers.Contract(sigmatorContractAddress, sigmatorAbi, signer)
        console.log("contractInstance", contractInstance)
        const postTableName = await contractInstance.getMarketTableName()
        console.log("postTableName", postTableName)
        const nftTableName = await contractInstance.getNftTableName()
        console.log("nftTableName", nftTableName)
        const contractInstance1 = new ethers.Contract(
            sigmatorClimateNFTContractAddress,
            sigmatorClimateNFTAbi,
            signer
        )
        const nftTableName1 = await contractInstance1.getNftTableName()
        console.log("nftTableName1", nftTableName1)
        // console.log("posts", posts)
        // setPosts(posts)
    }

    return <div className={styles.container}>{/* <Main /> */}</div>
}
