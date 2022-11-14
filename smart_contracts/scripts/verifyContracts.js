const { ethers, network, run } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
// const { Blob } = require("buffer")

async function verifyContracts() {
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    const chainId = network.config.chainId
    let tablelandRegistry = networkConfig[chainId].tablelandRegistry
    let vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
    let subscriptionId = networkConfig[chainId].subscriptionId
    let nftCreatePrice = networkConfig[chainId].nftCreatePrice
    let gasLane = networkConfig[chainId].gasLane
    let callbackGasLimit = networkConfig[chainId].callbackGasLimit
    let nftName = networkConfig[chainId].nftName
    let nftSymbol = networkConfig[chainId].nftSymbol
    console.log("Chain ID : " + chainId)
    try {
        const arguments = [
            tablelandRegistry,
            vrfCoordinatorV2Address,
            subscriptionId,
            gasLane,
            callbackGasLimit,
            nftCreatePrice,
        ]
        await run("verify:verify", {
            address: "0x1f99Dab8E1EE97EbC6227DbD87D57F4e7B6Bec08",
            constructorArguments: arguments,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
    try {
        const arguments = [
            nftName,
            nftSymbol,
            "https://SIGMATORTRYNFT.revise.link/",
            tablelandRegistry,
        ]
        await run("verify:verify", {
            address: "0x3f25e354de85d89e1fB9dB7e5ded81c65c9779eC",
            constructorArguments: arguments,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

verifyContracts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
