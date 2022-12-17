// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import {Script} from "forge-std/Script.sol";
import {AppEntrypoint} from "../src/AppEntrypoint.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        AppEntrypoint appEntrypoint = new AppEntrypoint();

        vm.stopBroadcast();
    }
}