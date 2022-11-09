import React, { useContext, useEffect, useState } from "react"
// import { useLocation, useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/PostCard"
import Posts from "./Posts"
import { showNotification, updateNotification } from "@mantine/notifications"
import {
    createStyles,
    SimpleGrid,
    Container,
    AspectRatio,
    Badge,
    Button,
    Card,
    Image,
    Modal,
    Text,
    Tooltip,
    ActionIcon,
    Group,
    Center,
    Avatar,
    Skeleton,
    Slider,
} from "@mantine/core"
import { CardsCarousel } from "./CardsCarousel"
import { IconCloudUpload, IconX, IconDownload, IconCheck } from "@tabler/icons"
import { ethers } from "ethers"
import {
    currency,
    postTableName,
    sigmatorAbi,
    sigmatorContractAddress,
    sigmatorNFTAbi,
} from "../constants"
import { useRouter } from "next/router"
import { useAccount, useSigner } from "wagmi"

const icp_fee = 10000
function PostPage() {
    // const params = useParams();
    const router = useRouter()
    const { postAddress: postContractAddress } = router.query
    const { isConnected } = useAccount()
    const { data: signer, isError, isLoading } = useSigner()
    // const [postContractAddress, setPostContractAddress] = useState("")

    const [title, setTitle] = useState("")
    const [nftName, setNftName] = useState("")
    const [description, setDescription] = useState("")
    const [owner, setOwner] = useState("")
    const [symbol, setSymbol] = useState("")
    const [images, setImages] = useState([])
    const [mintFee, setMintFee] = useState()
    const [totalNFTAvailable, setTotalNFTAvailable] = useState()
    const [nftRarities, setNftRarities] = useState([])
    const [loading, setLoading] = useState(true)
    const [found, setFound] = useState(false)
    const [mintModalOpened, setMintModalOpened] = useState(false)
    useEffect(() => {
        if (router.isReady) {
            console.log("router.query.postAddress", router.query.postAddress)
            fetchFromPost()
        }
    }, [router.isReady])

    const fetchFromPost = async () => {
        // console.log("postCanisterId", postCanisterId);
        const postsData = await fetch(
            "https://testnet.tableland.network/query?s=" +
                "SELECT * FROM " +
                postTableName +
                " WHERE nftAddress = '" +
                router.query.postAddress.toLowerCase() +
                "'"
        )
        const postsDataJson = await postsData.json()
        console.log("postsDataJson", postsDataJson)
        if (postsDataJson.length == 1) {
            const post = postsDataJson[0]
            const postData = await fetch(
                "https://" + post.finalCid + ".ipfs.w3s.link/sigmator.json"
            )
            const postJson = await postData.json()
            const { title, description } = postJson

            const postContractInstance = new ethers.Contract(
                post.nftAddress,
                sigmatorNFTAbi,
                ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com")
            )

            const sigmatorContractInstance = new ethers.Contract(
                sigmatorContractAddress,
                sigmatorAbi,
                ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com")
            )
            const totalNFTTokenAvailable = (
                await sigmatorContractInstance.getNftTotalToken(post.nftAddress)
            ).toString()

            console.log("totalNFTTokenAvailable", totalNFTTokenAvailable)

            const nftName = await postContractInstance.name()
            const symbol = await postContractInstance.symbol()
            const nftMintFee = ethers.utils
                .formatEther(await postContractInstance.getMintFee())
                .toString()

            const numberOfImages = await postContractInstance.getSigmatorTotalTokenUris()
            const images = []
            const rarities = []
            for (let i = 0; i < numberOfImages; i++) {
                const image = await postContractInstance.getSigmatorTokenUris(i)
                const rarity = (await postContractInstance.getSigmatorTokenRarity(i)).toString()
                images.push("https://" + image + ".ipfs.w3s.link/image")
                rarities.push(rarity)
            }
            setTitle(title)
            setDescription(description)
            setNftName(nftName)
            setSymbol(symbol)
            setMintFee(nftMintFee)
            setImages(images)
            setTotalNFTAvailable(totalNFTTokenAvailable)
            setNftRarities(rarities)
            // setMintFee(mintFee)
            setOwner(post.userAddress)
            // setMaxSupply(maxSupply)
            // setNftSupplied(nftSupplied)
            setFound(true)
        } else {
            setFound(false)
        }
        setLoading(false)
    }
    const data = images.map((image, index) => {
        return {
            index: index,
            image: image,
        }
    })

    const mint = async () => {
        console.log("minting...")
        showNotification({
            id: "load-data",
            loading: true,
            title: "Minting...",
            message: "Please wait while we mint your NFT.",
            autoClose: false,
            disallowClose: true,
        })

        try {
            const sigmatorContractInstance = new ethers.Contract(
                sigmatorContractAddress,
                sigmatorAbi,
                signer
            )

            const tx = await sigmatorContractInstance.requestNft(router.query.postAddress, {
                value: ethers.utils.parseUnits(mintFee, "ether"),
            })
            console.log("tx done")

            console.log("tx hash")
            console.log(tx.hash)
            console.log("-----------------------------")

            const response = await tx.wait()
            console.log("DONE!!!!!!!!!!!!!!!!!!")

            console.log("response")
            console.log(response)

            // console.log("response hash")
            // console.log(response.hash)
            console.log("-----------------------------")

            updateNotification({
                id: "load-data",
                color: "teal",
                title: "Minted Successfully",
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            })
            router.push("/profile/" + (await signer.getAddress()))
        } catch (error) {
            console.log("error", error)
            updateNotification({
                id: "load-data",
                autoClose: 5000,
                title: "Unable to Mint",
                message: "Check console for more details",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
        }
    }

    const handleMint = async () => {
        if (!isConnected) {
            showNotification({
                id: "hello-there",
                // onClose: () => console.log("unmounted"),
                // onOpen: () => console.log("mounted"),
                autoClose: 5000,
                title: "Connect Wallet",
                message: "Please connect your wallet to post content",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
            return
        } else {
            mint()
        }
    }

    // console.log("params", params);
    return (
        <>
            <Skeleton sx={loading ? { height: "85vh" } : null} visible={loading}>
                {found ? (
                    <>
                        <Text
                            // component="span"
                            align="center"
                            // variant="gradient"
                            // gradient={{ from: "red", to: "red", deg: 45 }}
                            size="xl"
                            weight={700}
                            mb="md"
                            style={{
                                fontFamily: "Greycliff CF, sans-serif",
                            }}
                        >
                            {title}
                        </Text>
                        <Center>
                            <Badge
                                variant="gradient"
                                gradient={{
                                    from: "teal",
                                    to: "lime",
                                    deg: 105,
                                }}
                                mb="md"
                            >
                                {parseInt(totalNFTAvailable) + " NFT available"}
                            </Badge>
                        </Center>

                        <Center>
                            <Tooltip
                                label="Post Owner"
                                transition="skew-up"
                                transitionDuration={300}
                                closeDelay={500}
                                color="lime"
                                withArrow
                            >
                                <Badge
                                    component="a"
                                    href={`/profile/${owner}`}
                                    sx={{ paddingLeft: 0, cursor: "pointer" }}
                                    mb="md"
                                    size="lg"
                                    radius="xl"
                                    color="teal"
                                    leftSection={
                                        <Avatar alt="Owner avatar" size={24} mr={5} src="null" />
                                    }
                                >
                                    {owner}
                                </Badge>
                            </Tooltip>
                        </Center>
                        <Text
                            // component="span"
                            align="center"
                            // variant="gradient"
                            // gradient={{ from: "red", to: "red", deg: 45 }}
                            size="md"
                            // weight={700}
                            mb="md"
                            style={{
                                fontFamily: "Greycliff CF, sans-serif",
                            }}
                        >
                            {description}
                        </Text>

                        <Center mt="lg">
                            <Badge
                                color="cyan"
                                variant="outline"
                                size="sm"
                                style={{
                                    fontFamily: "Greycliff CF, sans-serif",
                                }}
                            >
                                {nftName}
                            </Badge>
                        </Center>

                        {data && data.length > 0 && <CardsCarousel data={data} scr={true} />}

                        <div style={{ marginTop: "40px" }}>
                            {nftRarities &&
                                nftRarities.map((nftRarity) => {
                                    return (
                                        <Center>
                                            <Slider
                                                color="cyan"
                                                radius="xl"
                                                size="xl"
                                                sx={{ width: "70%" }}
                                                label={(value) => `${value}%`}
                                                onChange={() => {}}
                                                value={nftRarity}
                                                labelAlwaysOn
                                            />
                                        </Center>
                                    )
                                })}
                        </div>

                        <Center mt="lg">
                            <Badge
                                color="cyan"
                                variant="outline"
                                size="sm"
                                style={{
                                    fontFamily: "Greycliff CF, sans-serif",
                                }}
                            >
                                {symbol}
                            </Badge>
                        </Center>
                        {parseInt(totalNFTAvailable) > 0 ? (
                            <Center>
                                <Button
                                    mt="md"
                                    color="yellow"
                                    radius="md"
                                    size="md"
                                    onClick={() => {
                                        console.log("minting")
                                        handleMint()
                                    }}
                                >
                                    Mint
                                </Button>
                            </Center>
                        ) : (
                            <Tooltip
                                label="Max Supply Reached"
                                transition="skew-up"
                                transitionDuration={300}
                                closeDelay={500}
                                color="red"
                                withArrow
                            >
                                <Center>
                                    <Button mt="md" color="yellow" radius="md" size="md" disabled>
                                        Mint
                                    </Button>
                                </Center>
                            </Tooltip>
                        )}
                        <Text
                            // component="span"
                            align="center"
                            variant="gradient"
                            gradient={{ from: "red", to: "red", deg: 45 }}
                            size="md"
                            weight={700}
                            style={{
                                fontFamily: "Greycliff CF, sans-serif",
                                marginTop: "10px",
                            }}
                        >
                            Mint fee : {mintFee} {currency}
                        </Text>
                    </>
                ) : (
                    <Text
                        // component="span"
                        align="center"
                        // variant="gradient"
                        // gradient={{ from: "red", to: "red", deg: 45 }}
                        size="xl"
                        weight={700}
                        style={{
                            fontFamily: "Greycliff CF, sans-serif",
                            marginTop: "10px",
                        }}
                    >
                        Post not found
                    </Text>
                )}
            </Skeleton>
        </>
    )
}

export default PostPage
