## Details

A social platform where users can upload post, mint a post and earn when someone else mint their post. There is a post fee which user have to pay. They can upload upto 5 images per post & can assign rarirites to each image, mint fee for minting and total supply for NFTs of the post. When a user mint a post, they have to pay mint fee and will randomly get any of the post image as an NFT based on the rarity assign to each image. Some NFTs may become rare considering finite supply and randomly image assignment and rarities assign to each image for NFTs. Every user can get a free Green NFT, a special NFT which dynamically updates every day using Revise Network. It shows co2 emission of current day in the user's country to spread awareness about **Climate Change**. Their NFT will have a 2d map which will dynamically updates and they can see and interact with a 3d map on the website.

IPFS ( Filecoin ) is used to store almost all the contents (like images, title, description, json, etc.) and then to fetch it such that globaly everyone can see and appreciate the content in a decentralized way using web3.storage. All contracts are deployed on polygon chain. Revise network is used to dynamically update the NFT. Chainlink is used to get random number to select a particular NFT randomly considering it's rarity also. Tableland is used for decentralized sql database.
[deck.gl](https://deck.gl/) and [mapbox-gl](https://docs.mapbox.com/mapbox-gl-js/api/) are used to render a 3d interactive map and [staticmaps](https://github.com/komoot/staticmap) is used to render a 2d image which will be dynamically assign to the Green NFT.

| Tech stack used                   |
| --------------------------------- |
| [Filecoin](#filecoin)             |
| [Polygon](#polygon)               |
| [Revise Network](#revise-network) |
| [Chainlink](#chainlink)           |
| [Tableland](#tableland)           |

## Deployements

Deployed website at Vercel: [Genzer](https://climate3.vercel.app/)

## Getting Started

To run frontend :

```bash
cd client/my-app

yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To deploy smart contracts to localhost :

```bash
cd smart_contracts/

yarn hardhat deploy --network localhost
```

## Sponsors Used

### Filecoin

Filecoin was used to store almost all the contents (like images, title, description, json, etc.) and then to fetch it such that globaly everyone can see and appreciate the content in a decentralized way.

[Use case example in the project](https://github.com/Ahmed-Aghadi/climate3/blob/main/client/my-app/pages/api/image-upload-ipfs.js)

[Use case example in the project](https://github.com/Ahmed-Aghadi/climate3/blob/main/client/my-app/pages/api/json-upload-ipfs.js)

### Polygon

All the smart contracts are deployed on polygon mumbai testnet.

[Use case example in the project](https://github.com/Ahmed-Aghadi/climate3/tree/main/smart_contracts/deployments/mumbai)

[Use case example in the project](https://github.com/Ahmed-Aghadi/climate3/tree/main/smart_contracts/contracts)

### Revise Network

Revise is used to dynamically updates NFTs over time.

[Use case example in the project](https://github.com/Ahmed-Aghadi/climate3/blob/main/client/my-app/pages/api/setImage.js)

### Chainlink

Chainlink was used to randomly select an image out of all images of the post while also considering rarities assigned while minting.

[Use case example in the project](https://github.com/Ahmed-Aghadi/climate3/blob/main/smart_contracts/contracts/SigmatorNFTHandle.sol)

### Tableland

Tableland was used to store the public data of every users and appropriate URIs of contents to fetch it instantly and give a better user experience.

[Use case example in the project](https://github.com/Ahmed-Aghadi/climate3/blob/main/smart_contracts/contracts/SigmatorNFTTableland.sol)

[Use case example in the project](https://github.com/Ahmed-Aghadi/climate3/blob/main/smart_contracts/contracts/SigmatorClimateNFT.sol)
