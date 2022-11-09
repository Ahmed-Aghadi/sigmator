import React, { useRef, useState, useContext } from "react"
import {
    Text,
    Group,
    Button,
    createStyles,
    Title,
    TextInput,
    Tooltip,
    Progress,
    Skeleton,
    Container,
    Image,
    Badge,
    Center,
    NumberInput,
    NumberInputHandlers,
    ActionIcon,
    Switch,
    Slider,
    Modal,
    Textarea,
    Grid,
    SimpleGrid,
} from "@mantine/core"
import { ethers } from "ethers"
import { IconCloudUpload, IconX, IconDownload, IconCheck } from "@tabler/icons"
import { DropzoneButton } from "./DropzoneButton"
import { Sliders } from "./Sliders"
import { showNotification, updateNotification } from "@mantine/notifications"
// import BalanceContext from "../context/balanceContext"
// import DepositContext from "../context/depositContext"
import { useAccount } from "wagmi"
import { useSigner } from "wagmi"
import { useContractRead, useContractWrite, usePrepareContractWrite, useSignMessage } from "wagmi"
import { currency, sigmatorAbi, sigmatorContractAddress } from "../constants"
// import {
//     canisterId as genzerCanisterId,
//     createActor as createGenzerActor,
// } from "../../../declarations/genzer_backend/index"
// import {
//     canisterId as ledgerCanisterId,
//     createActor as createLegerActor,
// } from "../../../declarations/ledger/index"
// import { AuthClient } from "@dfinity/auth-client"
// import { useNavigate, useLocation } from "react-router-dom"
import { useRouter } from "next/router"

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "relative",
        marginBottom: 30,
        marginTop: 30,
    },

    dropzone: {
        borderWidth: 1,
        paddingBottom: 50,
    },

    icon: {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
    },

    control: {
        position: "absolute",
        width: 250,
        left: "calc(50% - 125px)",
        bottom: -20,
    },

    button: {
        marginTop: 20,
        marginBottom: 30,
    },

    progress: {
        position: "absolute",
        bottom: -1,
        right: -1,
        left: -1,
        top: -1,
        height: "auto",
        backgroundColor: "transparent",
        zIndex: 0,
    },

    label: {
        position: "relative",
        zIndex: 1,
    },
    card: {
        transition: "transform 150ms ease, box-shadow 150ms ease",

        "&:hover": {
            transform: "scale(1.01)",
            boxShadow: theme.shadows.md,
            cursor: "pointer",
        },
    },
}))

const minMintFee = 0.0000000000000000001
const maxFiles = 5
const nftCreatePrice = "0.01"

function Upload() {
    const router = useRouter()
    const { isConnected } = useAccount()
    const { data: signer, isError, isLoading } = useSigner()
    // const {
    //     data: nftCreatePrice, // post fee
    //     isFetched: isNftCreatePriceFetched,
    // } = useContractRead({
    //     addressOrName: sigmatorContractAddress,
    //     contractInterface: sigmatorAbi,
    //     functionName: "getNftCreatePrice",
    // })
    // const balanceCtx = useContext(BalanceContext)
    // const depositCtx = useContext(DepositContext)
    // const navigate = useNavigate()
    const [titleOpened, setTitleOpened] = useState(false)
    const [title, setTitle] = useState("")
    const [nftNameOpened, setNftNameOpened] = useState(false)
    const [nftName, setNftName] = useState("")
    const [description, setDescription] = useState("")
    const [symbol, setSymbol] = useState("")
    const [symbolOpened, setSymbolOpened] = useState(false)
    const symbolValid = !!symbol && symbol.length > 0
    const titleValid = title.length > 0
    const nftNameValid = nftName.length > 0
    const [mintFee, setMintFee] = useState(0)
    const [mintFeeOpened, setMintFeeOpened] = useState(false)
    const mintFeeValid = !!mintFee && Number.isInteger(parseInt(mintFee)) && mintFee >= minMintFee
    // console.log(Number.isInteger(mintFee));
    // console.log(mintFee);
    const [maxSupply, setMaxSupply] = useState(1)
    const [maxSupplyOpened, setMaxSupplyOpened] = useState(false)
    const maxSupplyValid = !!maxSupply && Number.isInteger(maxSupply) && maxSupply > 0
    const [files, setFiles] = useState([])
    const [sliderValues, setSliderValues] = useState([])
    const numberOfSliders = files ? files.length : 0
    const postValid =
        titleValid &&
        nftNameValid &&
        maxSupplyValid &&
        mintFeeValid &&
        symbolValid &&
        files &&
        files.length > 0 &&
        sliderValues.reduce((a, b) => a + b) === 100

    const handlePost = async () => {
        if (!isConnected) {
            showNotification({
                id: "hello-there",
                autoClose: 5000,
                title: "Connect Wallet",
                message: "Please connect your wallet to post content",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
            return
        }
        if (!postValid) {
            showNotification({
                id: "hello-there",
                // onClose: () => console.log("unmounted"),
                // onOpen: () => console.log("mounted"),
                autoClose: 5000,
                title: "Cannot post",
                message: "Filled in all the required fields and upload at least one file",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
            return
        }
        showNotification({
            id: "load-data",
            loading: true,
            title: "Posting...",
            message: "Please wait while we are posting your content to the blockchain",
            autoClose: false,
            disallowClose: true,
        })

        console.log(title, nftName, symbol, description, sliderValues, maxSupply, mintFee)

        // const contractInstance = new ethers.Contract(sigmatorContractAddress, sigmatorAbi, signer)

        // console.log(
        //     bafybeiabwgpixsvuwa5zicxfg3ghh6nbqdeipuv42lcee7y2a2fp7n7x2q,
        //     "nftName",
        //     "symbol",
        //     ethers.utils.parseUnits(mintFee.toString(), "ether"),
        //     parsedSliderValues,
        //     imagesCid,
        //     ethers.utils.parseUnits(maxSupply.toString(), "ether")
        // )
        // const tx = await contractInstance.upload(
        //     jsonCid,
        //     nftName,
        //     symbol,
        //     ethers.utils.parseUnits(mintFee.toString(), "ether"),
        //     parsedSliderValues,
        //     imagesCid,
        //     ethers.utils.parseUnits(maxSupply.toString(), "ether")
        // )

        // updateNotification({
        //     id: "load-data",
        //     color: "teal",
        //     title: "Posted Successfully",
        //     icon: <IconCheck size={16} />,
        //     autoClose: 2000,
        // })
        // return

        // const body = new FormData()
        // body.append("file", files[0])
        // console.log(
        //     "try",
        //     await (
        //         await fetch("/api/image-upload-ipfs", {
        //             method: "POST",
        //             body: body,
        //         })
        //     ).json()
        // )
        // return
        try {
            const imagesCid = []
            for (let i = 0; i < files.length; i++) {
                const body = new FormData()
                body.append("file", files[i])
                const resForImageCid = await fetch("/api/image-upload-ipfs", {
                    method: "POST",
                    body: body,
                })
                const jsonOfResForImageCid = await resForImageCid.json()
                const imageCid = jsonOfResForImageCid.cid
                imagesCid.push(imageCid)
                console.log("stored image with cid:", imageCid)
            }
            console.log("imagesCid", imagesCid)

            const resForJsonCid = await fetch("/api/json-upload-ipfs", {
                method: "POST",
                body: JSON.stringify({
                    title: title,
                    description: description,
                }),
                headers: { "Content-Type": "application/json" },
            })

            const jsonOfResForJsonCid = await resForJsonCid.json()

            const jsonCid = jsonOfResForJsonCid.cid
            console.log("stored json with cid:", jsonCid)

            // const parsedAmount = ethers.utils.parseUnits(goal, "ether")

            const contractInstance = new ethers.Contract(
                sigmatorContractAddress,
                sigmatorAbi,
                signer
            )

            console.log(
                jsonCid,
                nftName,
                symbol,
                ethers.utils.parseUnits(mintFee.toString(), "ether"),
                sliderValues,
                imagesCid,
                maxSupply,
                { value: ethers.utils.parseUnits(nftCreatePrice, "ether") }
            )
            const tx = await contractInstance.upload(
                jsonCid,
                nftName,
                symbol,
                ethers.utils.parseUnits(mintFee.toString(), "ether"),
                sliderValues,
                imagesCid,
                maxSupply,
                { value: ethers.utils.parseUnits(nftCreatePrice, "ether") }
            )
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
                title: "Posted Successfully",
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            })

            for (let i = 0; i < response.events.length; i++) {
                const event = response.events[i]
                if (event.event === "NFTCreated") {
                    router.push(`/post/${event.args[0]}`)
                }
            }

            // setPostModalOpened(false)
            // navigate("/profile")
            router.push("/profile")
        } catch (error) {
            console.log("error", error)
            updateNotification({
                id: "load-data",
                autoClose: 5000,
                title: "Unable to create post",
                message: "Check console for more details",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
        }
    }

    return (
        <>
            <Tooltip
                label={titleValid ? "All good!" : "Title shouldn't be empty"}
                position="bottom-start"
                withArrow
                opened={titleOpened}
                color={titleValid ? "teal" : undefined}
            >
                <TextInput
                    label="Title"
                    required
                    placeholder="Your title"
                    onFocus={() => setTitleOpened(true)}
                    onBlur={() => setTitleOpened(false)}
                    mt="md"
                    value={title}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                />
            </Tooltip>

            <Tooltip
                label={nftNameValid ? "All good!" : "NFT name shouldn't be empty"}
                position="bottom-start"
                withArrow
                opened={nftNameOpened}
                color={nftNameValid ? "teal" : undefined}
            >
                <TextInput
                    label="NFT Name"
                    required
                    placeholder="Your NFT name"
                    onFocus={() => setNftNameOpened(true)}
                    onBlur={() => setNftNameOpened(false)}
                    mt="md"
                    value={nftName}
                    onChange={(event) => setNftName(event.currentTarget.value)}
                />
            </Tooltip>

            <Tooltip
                label={
                    titleValid
                        ? "All good!"
                        : "Symbol shouldn't be empty and should be greater than 0"
                }
                position="bottom-start"
                withArrow
                opened={symbolOpened}
                color={symbolValid ? "teal" : undefined}
            >
                <TextInput
                    label="Symbol"
                    required
                    placeholder="Your symbol"
                    onFocus={() => setSymbolOpened(true)}
                    onBlur={() => setSymbolOpened(false)}
                    mt="md"
                    value={symbol}
                    onChange={(event) => setSymbol(event.currentTarget.value)}
                />
            </Tooltip>

            <Textarea
                label="Description"
                placeholder="Your description"
                mt="md"
                autosize
                minRows={2}
                maxRows={4}
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
            />
            <div style={{ marginTop: "25px" }}>
                <DropzoneButton
                    files={files}
                    setFiles={setFiles}
                    maxFiles={maxFiles}
                    onUpload={(filesUploaded) => {
                        const valueToFill = Math.floor(100 / filesUploaded.length)
                        if (valueToFill * filesUploaded.length === 100) {
                            setSliderValues(Array(filesUploaded.length).fill(valueToFill))
                        } else {
                            const newSliderValues = []
                            for (let i = 0; i < filesUploaded.length - 1; i++) {
                                newSliderValues.push(valueToFill)
                            }
                            newSliderValues.push(100 - valueToFill * (filesUploaded.length - 1))
                            setSliderValues(newSliderValues)
                        }
                    }}
                />
            </div>
            {sliderValues.length > 0 && (
                <div style={{ marginTop: "25px" }}>
                    <Text fw={500}>
                        Rarity for each image: <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Sliders sliderValues={sliderValues} setSliderValues={setSliderValues} />
                    <Center mt="lg">
                        <Text color="red" fw={700}>
                            Sum of rarities should be equal to 100
                        </Text>
                    </Center>
                </div>
            )}
            <Tooltip
                label={maxSupplyValid ? "All good!" : "max supply should be greater than 0"}
                position="bottom-start"
                withArrow
                opened={maxSupplyOpened}
                color={maxSupplyValid ? "teal" : undefined}
            >
                <TextInput
                    label="Max supply"
                    required
                    placeholder={"Your max supply"}
                    onFocus={() => setMaxSupplyOpened(true)}
                    onBlur={() => setMaxSupplyOpened(false)}
                    mt="md"
                    value={maxSupply}
                    // type="number"
                    min={1}
                    step="1"
                    onChange={(event) => {
                        let value = 0
                        if (event.target.value == "" || !event.target.value) {
                            value = 0
                            setMaxSupply(value)
                        } else if (Number.isInteger(parseInt(event.target.value))) {
                            value = parseInt(event.target.value)
                            setMaxSupply(value)
                        }
                    }}
                />
            </Tooltip>

            <Tooltip
                label={mintFeeValid ? "All good!" : "Minimum mint fee should be : " + minMintFee}
                position="bottom-start"
                withArrow
                opened={mintFeeOpened}
                color={mintFeeValid ? "teal" : undefined}
            >
                <TextInput
                    label={"Mint Fee ( in " + currency + " )"}
                    required
                    placeholder={"Your mint fee in " + currency}
                    onFocus={() => setMintFeeOpened(true)}
                    onBlur={() => setMintFeeOpened(false)}
                    mt="md"
                    value={mintFee}
                    type="number"
                    min={minMintFee}
                    step="1"
                    onWheel={(e) => e.target.blur()}
                    onChange={(event) => {
                        setMintFee(event.target.value)
                    }}
                />
            </Tooltip>
            <Text
                // component="span"
                mt="md"
                align="center"
                variant="gradient"
                gradient={{ from: "yellow", to: "red", deg: 45 }}
                size="md"
                weight={700}
                style={{ fontFamily: "Greycliff CF, sans-serif" }}
            >
                you will get 90% of the mint fee
            </Text>
            <Center mt="md">
                <Button
                    variant="gradient"
                    gradient={{ from: "teal", to: "lime", deg: 105 }}
                    onClick={() => {
                        handlePost()
                    }}
                >
                    Post
                </Button>
            </Center>
            <Text
                // component="span"
                mt="md"
                align="center"
                variant="gradient"
                gradient={{ from: "yellow", to: "red", deg: 45 }}
                size="md"
                weight={700}
                style={{ fontFamily: "Greycliff CF, sans-serif" }}
            >
                Post and NFT creation fee is {nftCreatePrice} {currency}
            </Text>
        </>
    )
}

export default Upload
