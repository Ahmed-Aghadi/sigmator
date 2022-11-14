// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./SigmatorNFT.sol";
import "./SigmatorNFTTableland.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error NeedMoreETH();
error NFTNotAvailable();
error WithdrawFailed();
error NftContractNotExists();

contract SigmatorNFTHandle is SigmatorNFTTableland, Ownable {
    struct NftRequest {
        address requester;
        address nftContract;
    }
    event NFTCreated(address sigmatorNFT, address owner);
    event NftRequested(uint256 requestId, address requester);
    event NftMinted(address minter, address nftContract, uint256 tokenId, uint256 tokenIndex);

    mapping(address => address) private nftToOwner;
    // VRF Helpers
    mapping(uint256 => NftRequest) private s_requestIdToNftRequest;
    mapping(address => uint256) private ownerToBalance;
    mapping(address => uint256) private nftToTotalToken; // total token of nft contract available

    uint256 private s_nftCreatePrice;

    constructor(address registry, uint256 nftCreatePrice) SigmatorNFTTableland(registry) {
        s_nftCreatePrice = nftCreatePrice;
    }

    function _createNFT(
        address msgSender,
        string memory finalCid,
        string memory nftName,
        string memory nftSymbol,
        uint256 mintFee,
        uint256[] memory sigmatorTokenRarity,
        string[] memory sigmatorTokenUris,
        uint256 sigmatorTotalToken,
        string memory groupId
    ) internal virtual {
        if (msg.value < s_nftCreatePrice) {
            revert NeedMoreETH();
        }
        require(
            sigmatorTokenRarity.length == sigmatorTokenUris.length,
            "Length of rarity and uri must be equal"
        );
        require(sigmatorTokenRarity.length > 0, "Length of rarity and uri must be greater than 0");
        require(sigmatorTotalToken > 0, "Total token must be greater than 0");
        require(sigmatorTokenUris.length <= 5, "Length of rarity and uri must be less than 5");
        // check sum of token rarity must be equal to 100
        uint256 sum = 0;
        for (uint256 i = 0; i < sigmatorTokenRarity.length; i++) {
            sum += sigmatorTokenRarity[i];
        }
        require(sum == 100, "Sum of token rarities must be equal to 100");
        SigmatorNFT sigmatorNFT = new SigmatorNFT(
            nftName,
            nftSymbol,
            mintFee,
            sigmatorTokenRarity,
            sigmatorTokenUris,
            sigmatorTotalToken
        );
        nftToTotalToken[address(sigmatorNFT)] = sigmatorTotalToken;
        nftToOwner[address(sigmatorNFT)] = msgSender;
        // " (id integer primary key, userAddress text NOT NULL, nftAddress text NOT NULL, postID integer NOT NULL);"
        _createNftEntry(msgSender, address(sigmatorNFT), groupId, finalCid);
        emit NFTCreated(address(sigmatorNFT), msgSender);
    }

    // Assumes the subscription is funded sufficiently.
    function _requestNft(address nftContractAddress, uint256 requestId) internal virtual {
        if (nftToOwner[nftContractAddress] == address(0)) {
            revert NftContractNotExists();
        }
        SigmatorNFT sigmatorNFT = SigmatorNFT(nftContractAddress);
        if (msg.value < sigmatorNFT.getMintFee()) {
            revert NeedMoreETH();
        }
        if (nftToTotalToken[nftContractAddress] == 0) {
            revert NFTNotAvailable();
        }

        nftToTotalToken[nftContractAddress] -= 1;

        s_requestIdToNftRequest[requestId] = NftRequest(msg.sender, nftContractAddress);
        emit NftRequested(requestId, msg.sender);
    }

    /**
     * @dev This is the function that Chainlink VRF node
     * calls.
     */
    function _fulfillRandomWords(
        uint256 requestId, /* requestId */
        uint256[] memory randomWords
    ) internal virtual {
        address nftOwner = s_requestIdToNftRequest[requestId].requester;
        address nftAddress = s_requestIdToNftRequest[requestId].nftContract;
        SigmatorNFT nftContract = SigmatorNFT(nftAddress);

        (uint256 tokenId, uint256 tokenIndex) = nftContract.mint(nftOwner, randomWords[0]);
        _createNftMintEntry(nftOwner, nftAddress, tokenId, tokenIndex);
        ownerToBalance[nftToOwner[nftAddress]] += (nftContract.getMintFee() * 90) / 100;
        emit NftMinted(nftOwner, nftAddress, tokenId, tokenIndex);
    }

    function _withdraw(address msgSender) internal virtual {
        require(ownerToBalance[msgSender] > 0);
        uint256 amount = ownerToBalance[msgSender];
        ownerToBalance[msgSender] = 0;
        (bool success, ) = payable(msgSender).call{value: amount}("");
        if (!success) {
            revert WithdrawFailed();
        }
    }

    function _withdrawMarketplace() internal virtual onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        if (!success) {
            revert WithdrawFailed();
        }
    }

    function setNftCreatePrice(uint256 nftCreatePrice) public onlyOwner {
        s_nftCreatePrice = nftCreatePrice;
    }

    function getNftCreatePrice() public view returns (uint256) {
        return s_nftCreatePrice;
    }

    function getNftContractOwner(address nftContract) public view returns (address) {
        return nftToOwner[nftContract];
    }

    function getNftContractOwnerBalance(address nftContractOwner) public view returns (uint256) {
        return ownerToBalance[nftContractOwner];
    }

    function getNftTotalToken(address nftContract) public view returns (uint256) {
        return nftToTotalToken[nftContract];
    }

    function getNftRequest(uint256 requestId) public view returns (NftRequest memory) {
        return s_requestIdToNftRequest[requestId];
    }
}
