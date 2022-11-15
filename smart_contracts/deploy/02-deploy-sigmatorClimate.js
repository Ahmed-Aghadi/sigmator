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
    let nftName = networkConfig[chainId].nftName
    let nftSymbol = networkConfig[chainId].nftSymbol
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    const arguments = [nftName, nftSymbol, "https://SIGMATORTRYNFT.revise.link/", tablelandRegistry]
    const sigmator = await deploy("SigmatorClimateNFT", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "climateNFT"]
