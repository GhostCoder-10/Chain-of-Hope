// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonation {
    struct Donation {
        address donor;
        uint256 amount;
    }

    address public owner;
    mapping(uint256 => Donation) public donations;
    uint256 public donationCount;

    event DonationReceived(address indexed donor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
        donationCount = 0;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation amount should be greater than zero.");
        
        Donation storage newDonation = donations[donationCount];
        newDonation.donor = msg.sender;
        newDonation.amount = msg.value;
        donationCount++;
        
        emit DonationReceived(msg.sender, msg.value);
    }

    function withdrawFunds() external onlyOwner {
        require(address(this).balance > 0, "No funds available to withdraw.");
        
        payable(owner).transfer(address(this).balance);
    }
}
