import { Button, Modal, Text, Center, NativeSelect } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useSigner } from "wagmi"
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons"
import {
    climateNftTableName,
    countryCodes,
    sigmatorClimateNFTAbi,
    sigmatorClimateNFTContractAddress,
} from "../constants/"
import { ethers } from "ethers"
import { currency, sigmatorAbi, sigmatorContractAddress } from "../constants"
import { showNotification, updateNotification } from "@mantine/notifications"
import { useRouter } from "next/router"

const arr = Object.keys(countryCodes)

const resArr = arr.map((item) => {
    return item + " - " + countryCodes[item]
})

function GreenMintButton() {
    const [opened, setOpened] = useState(false)
    const { data: signer, isError, isLoading, isRefetching } = useSigner()
    const [value, setValue] = useState(resArr[0])
    const [nftTokenId, setNftTokenId] = useState("")
    const [isNftAvailable, setIsNftAvailable] = useState(false)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        checkNFT()
    }, [signer, router, isRefetching])

    const viewGreenNFT = async () => {
        router.push("/greenNFT/" + nftTokenId)
    }

    const checkNFT = async () => {
        if (signer) {
            const address = await signer.getAddress()
            const NFTsData = await fetch(
                "https://testnet.tableland.network/query?s=" +
                    "SELECT * FROM " +
                    climateNftTableName +
                    " WHERE userAddress = '" +
                    address.toLowerCase() +
                    "'"
            )
            const NFTsDataJson = await NFTsData.json()
            console.log("NFTsDataJson", NFTsDataJson)
            if (NFTsDataJson.length > 0) {
                const tokenId = NFTsDataJson[0].tokenId
                setNftTokenId(tokenId)
                setIsNftAvailable(true)
            }
            setLoading(false)
        }
    }

    const handleMint = async () => {
        // const resForJson = await fetch("/api/setImage" + `?country=country&tokenId=tokenId`)
        // return
        console.log("value", value)
        const country = value.substring(0, 2)
        if (signer) {
            showNotification({
                id: "load-data",
                loading: true,
                title: "Minting...",
                message: "Please wait!",
                autoClose: false,
                disallowClose: true,
            })
            const userAddress = await signer.getAddress()
            const begin = new Date().toISOString().split("T")[0]
            // end after 1 day
            const end = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]

            const contractInstance = new ethers.Contract(
                sigmatorClimateNFTContractAddress,
                sigmatorClimateNFTAbi,
                signer
            )

            try {
                const tx = await contractInstance.mint(userAddress)
                console.log("tx", tx)
                const receipt = await tx.wait()
                console.log("receipt", receipt)
                await new Promise((r) => setTimeout(r, 3000))
                const NFTsData = await fetch(
                    "https://testnet.tableland.network/query?s=" +
                        "SELECT * FROM " +
                        climateNftTableName +
                        " WHERE userAddress = '" +
                        userAddress.toLowerCase() +
                        "'"
                )
                const NFTsDataJson = await NFTsData.json()
                console.log("NFTsDataJson", NFTsDataJson)
                if (NFTsDataJson == undefined || !NFTsDataJson || NFTsDataJson.length == 0) {
                    const resForJson = await fetch(
                        process.env.NEXT_PUBLIC_API_URL +
                            "/api/setImage" +
                            `?country=${country}&address=${userAddress.toLowerCase()}`
                    )

                    const jsonOfResForJson = await resForJson.json()

                    const result = jsonOfResForJson.result
                    console.log("minted result:", result)
                } else {
                    const tokenId = NFTsDataJson[0].tokenId
                    setNftTokenId(tokenId)

                    console.log("url", `?country=${country}&tokenId=${tokenId}`)

                    const resForJson = await fetch(
                        process.env.NEXT_PUBLIC_API_URL +
                            "/api/setImage" +
                            `?country=${country}&tokenId=${tokenId}`
                    )

                    const jsonOfResForJson = await resForJson.json()

                    const result = jsonOfResForJson.result
                    console.log("minted result:", result)
                }

                updateNotification({
                    id: "load-data",
                    color: "teal",
                    title: "Minted Successfully",
                    icon: <IconCheck size={16} />,
                    autoClose: 2000,
                })
            } catch (error) {
                console.log("error", error)
                updateNotification({
                    id: "load-data",
                    autoClose: 5000,
                    title: "Unable to mint",
                    message: "Check console for more details",
                    color: "red",
                    icon: <IconX />,
                    className: "my-notification-class",
                    loading: false,
                })
            }
        } else {
            console.log("please try again")
        }
    }

    return (
        <>
            {isNftAvailable
                ? !loading && (
                      <Button color="green" onClick={() => viewGreenNFT()}>
                          VIEW GREEN NFT
                      </Button>
                  )
                : !loading && (
                      <Button color="green" onClick={() => setOpened(true)}>
                          Mint FREE NFT
                      </Button>
                  )}
            <Modal
                size="80%"
                opened={opened}
                onClose={() => setOpened(false)}
                title="Mint FREE NFT!"
            >
                <Text color="green" size="xl" mb="md">
                    We provide FREE NFT, which will dynamically update with time. It will show co2
                    emission in current month. It's an initiative to spread awareness about climate
                    change.
                </Text>

                <NativeSelect
                    label="Your favorite library/framework"
                    placeholder="Your favorite library/framework"
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                    data={resArr}
                    rightSection={<IconChevronDown size={14} />}
                    rightSectionWidth={40}
                />

                <Center mt="md">
                    <Button
                        variant="gradient"
                        gradient={{ from: "teal", to: "lime", deg: 105 }}
                        onClick={() => {
                            handleMint()
                        }}
                    >
                        Mint
                    </Button>
                </Center>
            </Modal>
        </>
    )
}

export default GreenMintButton
