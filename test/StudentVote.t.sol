// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../contracts/StudentVote.sol";

contract StudentVoteTest is Test {
    StudentVote sv;
    address voter1 = address(0x123);

    function setUp() public {
        sv = new StudentVote();
    }

    function testInitialCandidatesCount() public {
        assertEq(sv.candidatesCount(), 3);
    }

    function testVoteIncrementsVoteCount() public {
        vm.prank(voter1);
        sv.vote(1);
        (, , uint votes) = sv.getCandidate(1);
        assertEq(votes, 1);
    }

    function testDoubleVoteFails() public {
        vm.prank(voter1);
        sv.vote(1);

        vm.prank(voter1);
        vm.expectRevert("لقد قمت بالتصويت مسبقا");
        sv.vote(2);
    }

    function testInvalidCandidateVoteFails() public {
        vm.prank(voter1);
        vm.expectRevert("مرشح غير صحيح");
        sv.vote(99);
    }
}
