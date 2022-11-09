const { network } = require("hardhat")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let tablelandRegistry = networkConfig[chainId].tablelandRegistry
    let vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
    let subscriptionId = networkConfig[chainId].subscriptionId
    let nftCreatePrice = networkConfig[chainId].nftCreatePrice
    let gasLane = networkConfig[chainId].gasLane
    let callbackGasLimit = networkConfig[chainId].callbackGasLimit
    let nftName = networkConfig[chainId].nftName
    let nftSymbol = networkConfig[chainId].nftSymbol
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    const arguments = [
        tablelandRegistry,
        vrfCoordinatorV2Address,
        subscriptionId,
        gasLane,
        callbackGasLimit,
        nftCreatePrice,
    ]
    const sigmator = await deploy("Sigmator", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "sigmator"]
