// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "base64-sol/base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SigmatorNFT is ERC721URIStorage, Ownable {
    uint256 private immutable i_mintFee;
    uint256 private s_tokenCounter;
    uint256 public s_requestId;
    string[] private s_sigmatorTokenUris;
    uint256[] private s_sigmatorTokenRarity;
    uint256 private s_sigmatorTotalToken;
    uint256 private constant MAX_CHANCE_VALUE = 100;

    event NftMinted(uint256 index, address minter);

    constructor(
        string memory nftName,
        string memory nftSymbol,
        uint256 mintFee,
        uint256[] memory sigmatorTokenRarity,
        string[] memory sigmatorTokenUris,
        uint256 sigmatorTotalToken
    ) ERC721(nftName, nftSymbol) {
        require((mintFee * 90) / 100 != 0, "Low mint fee"); //make sure that 90% of mint fee which owner will get isn't zero as it will be rounded off to int
        require(
            sigmatorTokenRarity.length == sigmatorTokenUris.length,
            "Rarity and Uris length must be equal"
        );
        i_mintFee = mintFee;
        s_sigmatorTotalToken = sigmatorTotalToken;
        s_sigmatorTokenRarity = sigmatorTokenRarity;
        s_sigmatorTokenUris = sigmatorTokenUris;
    }

    function mint(address nftOwner, uint256 randomWord)
        public
        onlyOwner
        returns (uint256, uint256)
    {
        s_sigmatorTotalToken -= 1;
        uint256 newItemId = s_tokenCounter;
        s_tokenCounter = s_tokenCounter + 1;
        uint256 moddedRng = randomWord % MAX_CHANCE_VALUE;
        uint256 tokenIndex = 0;
        uint256 raritySum = 0;
        for (uint256 i = 0; i < s_sigmatorTokenRarity.length; i++) {
            raritySum += s_sigmatorTokenRarity[i];
            if (moddedRng < raritySum) {
                tokenIndex = i;
                break;
            }
        }
        _safeMint(nftOwner, newItemId);
        _setTokenURI(newItemId, s_sigmatorTokenUris[tokenIndex]);
        emit NftMinted(tokenIndex, nftOwner);
        return (newItemId, tokenIndex);
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getSigmatorTokenUris(uint256 index) public view returns (string memory) {
        return s_sigmatorTokenUris[index];
    }

    function getSigmatorTokenRarity(uint256 index) public view returns (uint256) {
        return s_sigmatorTokenRarity[index];
    }

    function getSigmatorTotalTokenUris() public view returns (uint256) {
        return s_sigmatorTokenUris.length;
    }

    function getSigmatorTotalToken() public view returns (uint256) {
        return s_sigmatorTotalToken;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
