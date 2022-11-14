// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "./SigmatorNFTTableland.sol";
import "./SigmatorNFTHandle.sol";
import "./SigmatorClimateNFT.sol";

contract Sigmator is ERC721Holder, VRFConsumerBaseV2, SigmatorNFTTableland, SigmatorNFTHandle {
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;

    constructor(
        address registry,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit,
        uint256 nftCreatePrice
    ) VRFConsumerBaseV2(vrfCoordinatorV2) SigmatorNFTHandle(registry, nftCreatePrice) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function upload(
        string memory finalCid,
        string memory nftName,
        string memory nftSymbol,
        uint256 mintFee,
        uint256[] memory sigmatorTokenRarity,
        string[] memory sigmatorTokenUris,
        uint256 sigmatorTotalToken,
        string memory groupId
    ) public payable {
        _createNFT(
            msg.sender,
            finalCid,
            nftName,
            nftSymbol,
            mintFee,
            sigmatorTokenRarity,
            sigmatorTokenUris,
            sigmatorTotalToken,
            groupId
        );
    }

    // Assumes the subscription is funded sufficiently.
    function requestNft(address nftContractAddress) public payable returns (uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        _requestNft(nftContractAddress, requestId);
    }

    /**
     * @dev This is the function that Chainlink VRF node
     * calls.
     */
    function fulfillRandomWords(
        uint256 requestId, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        _fulfillRandomWords(requestId, randomWords);
    }

    function withdraw() public {
        _withdraw(msg.sender);
    }

    function withdrawMarketplace() public {
        _withdrawMarketplace();
    }
}
