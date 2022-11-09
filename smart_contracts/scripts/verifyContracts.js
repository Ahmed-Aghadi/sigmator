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
            nftName,
            nftSymbol,
        ]
        await run("verify:verify", {
            address: "0xaA5Bc908107902F6845495667ce73BF7D8c56E27",
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
