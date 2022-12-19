| Contents                            |
| ----------------------------------- |
| [Deployements](#deployements)       |
| [Details](#details)                 |
| [Smart Contracts](#smart-contracts) |
| [Tech Stack Used](#tech-stack-used) |
| [Features](#features)               |
| [Getting Started](#getting-started) |

## Deployements

Deployed website at Spheron: [Sigmator](https://sigmator-3345fc.spheron.app/)

Deployed website at Vercel: [Sigmator](https://sigmator.vercel.app/)

## Details

A social platform where users can upload post, mint a post and earn when someone else mint their post. There is a post fee which user have to pay. They can upload upto 5 images per post & can assign rarirites to each image, mint fee for minting and total supply for NFTs of the post. When a user mint a post, they have to pay mint fee and will randomly get any of the post image as an NFT based on the rarity assign to each image. Some NFTs may become rare considering finite supply and randomly image assignment and rarities assign to each image for NFTs. Every user can get a free Green NFT, a special NFT which dynamically updates every month using Revise Network. It shows co2 emission of current day in the user's country to spread awareness about **Climate Change**. Their NFT will have a 2d map which will dynamically updates and they can see and interact with a 3d map on the website. Users can also make comments (under the hood, all these comments are on the ceramic network using orbis.club)

IPFS ( Filecoin ) is used to store almost all the contents (like images, title, description, json, etc.) and then to fetch it such that globaly everyone can see and appreciate the content in a decentralized way using web3.storage. All contracts are deployed on polygon chain. Revise network is used to dynamically update the NFT. Chainlink is used to get random number to select a particular NFT randomly considering it's rarity also. Tableland is used for decentralized sql database. Orbis is used for providing user an ability to make comments on ceramic network.

[deck.gl](https://deck.gl/) and [mapbox-gl](https://docs.mapbox.com/mapbox-gl-js/api/) are used to render a 3d interactive map and [staticmaps](https://github.com/komoot/staticmap) is used to render a 2d image which will be dynamically assign to the Green NFT.

## Smart Contracts

[Solidity files](https://github.com/Ahmed-Aghadi/sigmator/tree/main/smart_contracts/contracts)

[Smart Contracts Addresses](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/constants/contractAddress.json)

### Verified Smart Contracts on polygonscan

[Sigmator](https://mumbai.polygonscan.com/address/0x1f99dab8e1ee97ebc6227dbd87d57f4e7b6bec08#code)

[SigmatorClimateNFT](https://mumbai.polygonscan.com/address/0x3f25e354de85d89e1fb9db7e5ded81c65c9779ec#code)

## Tech Stack Used

| Tech stack used                   |
| --------------------------------- |
| [Polygon](#polygon)               |
| [Moralis](#moralis)               |
| [Filecoin](#filecoin)             |
| [Orbis.club](#orbisclub)          |
| [Tableland](#tableland)           |
| [Revise Network](#revise-network) |
| [Chainlink](#chainlink)           |
| [Mantine UI](#mantine-ui)         |
| [MapBox](#mapbox)                 |
| [Deckgl](#deckgl)                 |
| [Static Maps](#static-maps)       |

## Features

-   Provides user an ability to make posts which will be an NFT with minting fee, multiple URIs (each image of the post is mapped with the URI) and each URIs having rarities assigned to them.

-   All the images, title, description, etc. are stored in **IPFS** using web3.storage

-   Furthermore, **tableland** is used to have a **decentralized SQL Database**.

-   Users can also make comments on the posts on **ceramic network** using **Orbis.club** which is based on the **IPFS libP2P stack**.

-   When a user mint an NFT, they may get anyof the NFTs based on the **randomness** using **ChainLink Oracles** and rarities.

-   Every user can mint a Free Green NFT, a **dynamic NFT** which shows co2 emission of a particular country and updates itself every month using **Revise Network**. It's an initiaive for spreading awareness for **climate change**. As every profile will have their Green NFT associated and anyone can see that NFT and visualize co2 emission of that country.

-   Green NFT will have a **2D rendered** map image (using **static maps**) showing co2 emission of a particular country but user can view a **3D interactive** version (using **mapbox** and **deck.gl**) on the website.

## Getting Started

To run frontend :

```bash
cd client/my-app

yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To deploy smart contracts :

```bash
cd smart_contracts/

# to deploy on localhost
yarn hardhat deploy --network localhost

# OR

# to deploy on polygon mumbai testnet
yarn hardhat deploy --network mumbai
```

## Tech Stacks

### Polygon

All the smart contracts are deployed on polygon mumbai testnet.

[Deployements](https://github.com/Ahmed-Aghadi/sigmator/tree/main/smart_contracts/deployments/mumbai)

[Smart Contracts](https://github.com/Ahmed-Aghadi/sigmator/tree/main/smart_contracts/contracts)

### Moralis

Connection to blockchain and uploading json to folder in ipfs was done using moralis and moralis api.

#### Atleast one example:

[uploading json inside a folder in ipfs](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/components/Upload.jsx#L277)

[fetching data from contracts](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/pages/index.js#L30)

### Filecoin

Web3.storage was used to store almost all the contents (like images, title, description in json, etc.) and then to fetch it such that globaly everyone can see and appreciate the content in a decentralized way.

[Images uploading to IPFS](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/pages/api/image-upload-ipfs.js)

[JSON uploading to IPFS](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/pages/api/json-upload-ipfs.js)

### Tableland

Tableland was used to store the public data of every users and appropriate URIs of contents to fetch it instantly and give a better user experience.

[Tableland in smart contracts](https://github.com/Ahmed-Aghadi/sigmator/blob/main/smart_contracts/contracts/SigmatorNFTTableland.sol)

[Tableland in smart contracts](https://github.com/Ahmed-Aghadi/sigmator/blob/main/smart_contracts/contracts/SigmatorClimateNFT.sol)

### Revise Network

Revise is used to dynamically updates NFTs over time.

[Dynamically updating the NFT](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/pages/api/setImage.js)

### Chainlink

Chainlink was used to randomly select an image out of all images of the post while also considering rarities assigned while minting.

[Chainlink VRF Coordinator](https://github.com/Ahmed-Aghadi/sigmator/blob/main/smart_contracts/contracts/SigmatorNFTHandle.sol)

### Orbis.club

Orbis is used to provide users an ability to make comments on any post on ceramic network which is based on the IPFS libP2P stack.

[Creating a group](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/components/Upload.jsx#L329)

[sending posts in the group](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/components/ChatBox.js#L89)

[fetching posts made in the group](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/components/ChatBox.js#L106)

### Mantine UI

Mantine ui was heavily used in front end for styling.

### Mapbox

Mapbox was used to give user an interactive 3D map

[GreenNFT component](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/components/GreenNFT.js#L142)

### Deckgl

Deckgl was used to plot points on 3D map and let user visualize co2 emission properly.

[GreenNFT component](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/components/GreenNFT.js#L135)

### Static Maps

Static Maps was used to get a 2D map and ability to plot points on the map and then the image generated is used to dynamically update the Green NFT of users.

[GreenNFT component](https://github.com/Ahmed-Aghadi/sigmator/blob/main/client/my-app/components/GreenNFT.js#L135)
