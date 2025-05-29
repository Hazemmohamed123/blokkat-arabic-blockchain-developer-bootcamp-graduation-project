
a/ SPDX-License-Identifier: MIT solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/StudentVote.sol";

contract DeployStudentVote is Script {
	    function run() public {
		            vm.startBroadcast();
			            new StudentVote();
				            vm.stopBroadcast();
					        }
}

pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/StudentVote.sol";

contract DeployStudentVote is Script {
    function run() public {
        vm.startBroadcast();
        new StudentVote();
        vm.stopBroadcast();
    }
}
