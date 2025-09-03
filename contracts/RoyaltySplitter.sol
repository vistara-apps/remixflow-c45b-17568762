    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    contract RoyaltySplitter {
      struct Split {
        address recipient;
        uint percentage;
      }

      event RoyaltiesSplit(address remixCreator, uint amount);

      function splitRoyalties(Split[] memory splits, address payable creator) external payable {
        uint totalPercentage = 0;
        for (uint i = 0; i < splits.length; i++) {
          totalPercentage += splits[i].percentage;
        }
        require(totalPercentage <= 100, "Total percentage exceeds 100");

        uint amount = msg.value;
        for (uint i = 0; i < splits.length; i++) {
          uint share = (amount * splits[i].percentage) / 100;
          payable(splits[i].recipient).transfer(share);
        }
        creator.transfer(amount - (amount * totalPercentage / 100)); // Remainder to creator

        emit RoyaltiesSplit(creator, amount);
      }
    }
  