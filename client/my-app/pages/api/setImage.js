// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import StaticMaps from "staticmaps"
import { Revise } from "revise-sdk"
import fs from "fs"
const AUTH_TOKEN = process.env.AUTH_TOKEN
const revise = new Revise({ auth: AUTH_TOKEN })
import { v4 as uuidv4 } from "uuid"
import { climateNftTableName } from "../../constants"

async function run(country, tokenId) {
    const begin = new Date().toISOString().split("T")[0]
    const end = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] // 1 day from now
    // console.log("_________________________________________")
    // const collections = await revise.fetchCollections()
    // console.log("collections", collections)
    // return
    // const uri = uuidv4()
    // console.log("uri", uri)
    // const collection = await revise.addCollection({
    //     name: "GREEN",
    //     uri: "SIGMATORTRYNFT",
    // })
    // console.log("collection", collection)
    // return
    // console.log("_________________________________________")
    // collection { id: '6704fcc3-f183-4e21-aef6-7baf4b777399' }
    const collection = { id: "6704fcc3-f183-4e21-aef6-7baf4b777399" }

    // const nftReturned = await revise.addNFT(
    //     {
    //         image: await generateImageURL(country),
    //         name: "Star Lord",
    //         tokenId: "1",
    //         description: "This is a test description",
    //     },
    //     [{ attack: "80" }, { color: "maroon" }, { stamina: "90" }],
    //     "c136054a-bce5-469c-8bbf-ec510715594b"
    // )

    // revise.fetchNFTs(collection.id).then((nfts) => {
    //     console.log("nfts", nfts)
    // })
    // return

    const nftReturned = await revise.addNFT(
        {
            image: "https://revise-testing.fra1.digitaloceanspaces.com/sample-collection/1.jpg",
            name: "GREEN NFT",
            tokenId: tokenId,
            description: "This is a climate NFT",
        },
        [{ country: country }, { begin: begin }, { end: end }],
        collection.id
    )
    console.log("nftReturned", nftReturned)

    const nftObj = await revise.fetchNFT(nftReturned.id)
    const nft = revise.nft(nftObj)
    revise
        .every("43800m") // 43800 min = 30 days
        .listenTo(function () {
            return generateImageURL(country)
        })
        .start((apiData) => {
            console.log("apiData", apiData)
            nft.setImage(apiData.link)
                .setProperty("begin", apiData.begin)
                .setProperty("end", apiData.end)
                .save()
        })
    return nft.id
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const generateImageURL = async (country) => {
    console.log(country)
    // to set random dates
    // const d = randomDate(new Date(2020, 0, 1), new Date())
    // const begin = d.toISOString().split("T")[0] // random date
    // const end = new Date(d.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] // random date + 1 day

    const begin = new Date().toISOString().split("T")[0] // now
    // const end = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] // 1 day from now

    const end = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0] // 1 month from now
    const url =
        process.env.NEXT_PUBLIC_API_URL +
        "/api/image/" +
        `?country=${country}&begin=${begin}&end=${end}`
    return { link: url, begin: begin, end: end }
}

const fetchTokenId = async (address) => {
    const run = true
    while (run) {
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
        if (NFTsDataJson == undefined || !NFTsDataJson || NFTsDataJson.length == 0) {
            console.log("tokenId not found")
            await new Promise((r) => setTimeout(r, 3000))
        } else {
            const tokenId = NFTsDataJson[0].tokenId
            console.log("tokenId found", tokenId)
            run = false
            return tokenId
        }
    }
}

export default async function handler(req, res) {
    const { country, tokenId, address } = req.query
    console.log(req.query)
    if (!tokenId || tokenId == undefined) {
        if (!address) {
            await run()
            res.status(200).json({ id: "-1" })
            return
        }
        const tokenIdFetched = await fetchTokenId(address)
        const id = await run(country, tokenIdFetched)
        res.status(200).json({ id: id })
        return
    }
    const id = await run(country, tokenId)
    res.status(200).json({ id: id })
}
