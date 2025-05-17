// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {FundMe} from "../src/FundMe.sol";

contract DeployFundMe is Script {
    // Price Feed Addresses
    // address constant SEPOLIA_PRICE_FEED = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
    address constant SEPOLIA_PRICE_FEED = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
    address constant ANVIL_PRICE_FEED = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

    function run() external returns (FundMe) {
        // Get environment from command line argument, default to "anvil"
        string memory environment = vm.envString("ENVIRONMENT");

        // Get private key from environment variable
        uint256 deployerKey = vm.envUint("TEST_WALLET_PRIVATE_KEY");

        // Get the appropriate price feed address based on environment
        address priceFeed = getPriceFeedAddress(environment);

        // Start broadcasting transactions
        vm.startBroadcast(deployerKey);

        // Deploy the FundMe contract with the appropriate price feed
        FundMe fundMe = new FundMe(priceFeed);

        vm.stopBroadcast();
        return fundMe;
    }

    function getPriceFeedAddress(string memory environment) internal pure returns (address) {
        if (keccak256(bytes(environment)) == keccak256(bytes("sepolia"))) {
            return SEPOLIA_PRICE_FEED;
        } else if (keccak256(bytes(environment)) == keccak256(bytes("anvil"))) {
            return ANVIL_PRICE_FEED;
        } else {
            revert("Invalid environment. Use 'anvil' or 'sepolia'");
        }
    }
}
