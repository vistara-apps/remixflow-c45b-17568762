// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RoyaltySplitter
 * @dev Contract for splitting royalty payments between multiple recipients
 */
contract RoyaltySplitter is Ownable, ReentrancyGuard {
    struct Split {
        address recipient;
        uint256 percentage;
    }

    struct RemixRoyalty {
        string remixId;
        address creator;
        Split[] splits;
        uint256 totalReceived;
        uint256 lastDistribution;
    }

    // Mapping from remix ID to royalty information
    mapping(string => RemixRoyalty) private _remixRoyalties;
    
    // Array of all remix IDs
    string[] private _allRemixIds;

    // Events
    event RoyaltiesSplit(string indexed remixId, address indexed remixCreator, uint256 amount);
    event RoyaltyRegistered(string indexed remixId, address indexed creator);
    event RoyaltyReceived(string indexed remixId, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Registers a new remix for royalty distribution
     * @param remixId Unique identifier for the remix
     * @param creator Address of the remix creator
     * @param splits Array of royalty splits
     */
    function registerRemix(
        string memory remixId,
        address creator,
        Split[] memory splits
    ) external {
        require(bytes(remixId).length > 0, "Remix ID cannot be empty");
        require(creator != address(0), "Creator address cannot be zero");
        
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < splits.length; i++) {
            require(splits[i].recipient != address(0), "Recipient address cannot be zero");
            require(splits[i].percentage > 0, "Percentage must be greater than zero");
            totalPercentage += splits[i].percentage;
        }
        require(totalPercentage <= 100, "Total percentage exceeds 100");

        // Create a storage copy of the splits array
        Split[] storage storedSplits = _remixRoyalties[remixId].splits;
        for (uint256 i = 0; i < splits.length; i++) {
            storedSplits.push(Split({
                recipient: splits[i].recipient,
                percentage: splits[i].percentage
            }));
        }

        _remixRoyalties[remixId].remixId = remixId;
        _remixRoyalties[remixId].creator = creator;
        _remixRoyalties[remixId].totalReceived = 0;
        _remixRoyalties[remixId].lastDistribution = block.timestamp;
        
        _allRemixIds.push(remixId);
        
        emit RoyaltyRegistered(remixId, creator);
    }

    /**
     * @dev Splits royalties for a specific remix
     * @param remixId ID of the remix
     */
    function splitRoyalties(string memory remixId) external payable nonReentrant {
        require(bytes(remixId).length > 0, "Remix ID cannot be empty");
        require(msg.value > 0, "Amount must be greater than zero");
        require(_remixRoyalties[remixId].creator != address(0), "Remix not registered");

        RemixRoyalty storage royalty = _remixRoyalties[remixId];
        address payable creator = payable(royalty.creator);
        
        uint256 amount = msg.value;
        royalty.totalReceived += amount;
        royalty.lastDistribution = block.timestamp;
        
        uint256 totalDistributed = 0;
        
        // Distribute to recipients
        for (uint256 i = 0; i < royalty.splits.length; i++) {
            uint256 share = (amount * royalty.splits[i].percentage) / 100;
            if (share > 0) {
                payable(royalty.splits[i].recipient).transfer(share);
                totalDistributed += share;
            }
        }
        
        // Remainder to creator
        if (amount > totalDistributed) {
            creator.transfer(amount - totalDistributed);
        }
        
        emit RoyaltiesSplit(remixId, creator, amount);
    }

    /**
     * @dev Receive function to accept ETH payments
     */
    receive() external payable {
        emit RoyaltyReceived("default", msg.value);
    }

    /**
     * @dev Gets royalty information for a remix
     * @param remixId ID of the remix
     * @return creator Creator address
     * @return totalReceived Total amount received
     * @return lastDistribution Timestamp of last distribution
     * @return splitCount Number of splits
     */
    function getRoyaltyInfo(string memory remixId) 
        external 
        view 
        returns (
            address creator,
            uint256 totalReceived,
            uint256 lastDistribution,
            uint256 splitCount
        ) 
    {
        RemixRoyalty storage royalty = _remixRoyalties[remixId];
        return (
            royalty.creator,
            royalty.totalReceived,
            royalty.lastDistribution,
            royalty.splits.length
        );
    }

    /**
     * @dev Gets a specific split for a remix
     * @param remixId ID of the remix
     * @param index Index of the split
     * @return recipient Recipient address
     * @return percentage Percentage of the split
     */
    function getSplit(string memory remixId, uint256 index) 
        external 
        view 
        returns (
            address recipient,
            uint256 percentage
        ) 
    {
        require(index < _remixRoyalties[remixId].splits.length, "Index out of bounds");
        Split storage split = _remixRoyalties[remixId].splits[index];
        return (split.recipient, split.percentage);
    }

    /**
     * @dev Gets all remix IDs
     * @return Array of remix IDs
     */
    function getAllRemixIds() external view returns (string[] memory) {
        return _allRemixIds;
    }

    /**
     * @dev Withdraws any stuck funds to the owner
     * @param amount Amount to withdraw
     */
    function withdrawStuckFunds(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(amount);
    }
}
