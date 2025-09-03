// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RemixProvenance
 * @dev Contract for tracking the provenance of remixes as NFTs
 */
contract RemixProvenance is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to original content IPFS hash
    mapping(uint256 => string) private _originalContentHashes;
    
    // Mapping from token ID to remix creator address
    mapping(uint256 => address) private _remixCreators;
    
    // Mapping from token ID to remix transformation type
    mapping(uint256 => string) private _transformationTypes;
    
    // Mapping from original content hash to array of remix token IDs
    mapping(string => uint256[]) private _remixesByOriginalContent;

    // Event emitted when a new remix is minted
    event RemixMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string originalContentHash,
        string remixContentHash,
        string transformationType
    );

    /**
     * @dev Constructor
     */
    constructor() ERC721("RemixFlow Provenance", "RFP") Ownable(msg.sender) {}

    /**
     * @dev Mints a new remix NFT
     * @param creator Address of the remix creator
     * @param originalContentHash IPFS hash of the original content
     * @param remixContentHash IPFS hash of the remixed content
     * @param transformationType Type of transformation applied
     * @param tokenURI URI for the token metadata
     * @return The ID of the newly minted token
     */
    function mintRemix(
        address creator,
        string memory originalContentHash,
        string memory remixContentHash,
        string memory transformationType,
        string memory tokenURI
    ) public returns (uint256) {
        require(bytes(originalContentHash).length > 0, "Original content hash cannot be empty");
        require(bytes(remixContentHash).length > 0, "Remix content hash cannot be empty");
        require(creator != address(0), "Creator address cannot be zero");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(creator, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _originalContentHashes[newTokenId] = originalContentHash;
        _remixCreators[newTokenId] = creator;
        _transformationTypes[newTokenId] = transformationType;
        _remixesByOriginalContent[originalContentHash].push(newTokenId);

        emit RemixMinted(
            newTokenId,
            creator,
            originalContentHash,
            remixContentHash,
            transformationType
        );

        return newTokenId;
    }

    /**
     * @dev Returns the original content hash for a given token ID
     * @param tokenId The ID of the token
     * @return The original content hash
     */
    function getOriginalContentHash(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _originalContentHashes[tokenId];
    }

    /**
     * @dev Returns the remix creator for a given token ID
     * @param tokenId The ID of the token
     * @return The remix creator address
     */
    function getRemixCreator(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _remixCreators[tokenId];
    }

    /**
     * @dev Returns the transformation type for a given token ID
     * @param tokenId The ID of the token
     * @return The transformation type
     */
    function getTransformationType(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _transformationTypes[tokenId];
    }

    /**
     * @dev Returns all remix token IDs for a given original content hash
     * @param originalContentHash The original content hash
     * @return Array of token IDs
     */
    function getRemixesByOriginalContent(string memory originalContentHash) public view returns (uint256[] memory) {
        return _remixesByOriginalContent[originalContentHash];
    }

    /**
     * @dev Returns the total number of remixes minted
     * @return The total number of remixes
     */
    function getTotalRemixes() public view returns (uint256) {
        return _tokenIds.current();
    }
}

