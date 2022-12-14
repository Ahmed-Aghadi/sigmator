const sigmatorAbi = require("./Sigmator.abi.json")
const sigmatorNFTAbi = require("./SigmatorNFT.abi.json")
const sigmatorClimateNFTAbi = require("./SigmatorClimateNFT.abi.json")
const contractAddress = require("./contractAddress.json")
const tableNames = require("./tableNames.json")
const countryCodes = require("./countryCodes.json")
const collection = require("./climateNFTCollection.json")
const sigmatorContractAddress = contractAddress.sigmator
const sigmatorClimateNFTContractAddress = contractAddress.SigmatorClimateNFT
const postTableName = tableNames.post
const nftTableName = tableNames.nft
const climateNftTableName = tableNames.climateNft
const climateNFTCollectionURI = collection.uri
const currency = "MATIC"
const ipfsGateway = (cid, suffixUrl) => {
    return "https://" + cid + ".ipfs.w3s.link/" + suffixUrl
}
const ipfsGateway1 = (cid, suffixUrl) => {
    return "https://ipfs.io/ipfs/" + cid + "/" + suffixUrl
}
module.exports = {
    sigmatorAbi,
    sigmatorNFTAbi,
    sigmatorClimateNFTAbi,
    sigmatorContractAddress,
    sigmatorClimateNFTContractAddress,
    postTableName,
    nftTableName,
    climateNftTableName,
    countryCodes,
    climateNFTCollectionURI,
    currency,
    ipfsGateway,
    ipfsGateway1,
}
