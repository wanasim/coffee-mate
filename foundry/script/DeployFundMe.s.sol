// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {FundMe} from "../src/FundMe.sol";

contract DeployFundMe is Script {
    function run() external returns (FundMe) {
        // Get private key from environment variable
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerKey);

        // Deploy the FundMe contract
        // For Sepolia testnet, use: 0x694AA1769357215DE4FAC081bf1f309aDC325306
        // For local network, use: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        FundMe fundMe = new FundMe(0x694AA1769357215DE4FAC081bf1f309aDC325306);

        vm.stopBroadcast();
        return fundMe;
    }
}
