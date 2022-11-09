// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "base64-sol/base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SigmatorClimateNFT is ERC721 {
    uint256 private s_tokenCounter;
    string baseuri = "";

    uint256 private _nftTableId;
    string private _nftTableName;
    string private _prefix = "sigmator";
    // Interface to the `TablelandTables` registry contract
    ITablelandTables private _tableland;

    /* Functions */
    constructor(
        string memory nftName,
        string memory nftSymbol,
        string memory _baseuri,
        address registry
    ) ERC721(nftName, nftSymbol) {
        baseuri = _baseuri;
        _tableland = ITablelandTables(registry);

        _nftTableId = _tableland.createTable(
            address(this),
            /*
             *  CREATE TABLE {prefix}_{chainId} (
             *    id integer primary key,
             *    message text
             *  );
             */
            string.concat(
                "CREATE TABLE ",
                _prefix,
                "_",
                Strings.toString(block.chainid),
                " (id integer primary key, userAddress text NOT NULL, tokenId integer NOT NULL);"
            )
        );

        _nftTableName = string.concat(
            _prefix,
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_nftTableId)
        );
    }

    function mint(address nftOwner) public returns (uint256) {
        // one nft per address
        require(balanceOf(nftOwner) == 0, "NFT already minted");
        uint256 newItemId = s_tokenCounter;
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(nftOwner, newItemId);
        _tableland.runSQL(
            address(this),
            _nftTableId,
            string.concat(
                "INSERT INTO ",
                _nftTableName,
                " (userAddress, tokenId) VALUES (",
                "'",
                _addressToString(nftOwner),
                "','",
                Strings.toString(newItemId),
                "');"
            )
        );
        return newItemId;
    }

    function _addressToString(address x) public pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(uint160(x)) / (2**(8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string.concat("0x", string(s));
    }

    function char(bytes1 b) public pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function getNftTableName() public view returns (string memory) {
        return _nftTableName;
    }

    function _baseURI() internal view override(ERC721) returns (string memory) {
        return baseuri;
    }

    function getNftTableId() public view returns (uint256) {
        return _nftTableId;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
