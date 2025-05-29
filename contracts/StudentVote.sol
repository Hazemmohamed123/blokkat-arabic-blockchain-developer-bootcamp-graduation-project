// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract StudentVote {
    struct Candidate {
        uint id;
        string name;
        string description;
        uint voteCount;
    }

    mapping(address => bool) public hasVoted;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    address public admin;

    event Voted(address voter, uint candidateId);

    constructor() {
        admin = msg.sender;
        addCandidate("محمد أحمد", "الفرقة الرابعة (ميكانيكا) - أسعى لتعزيز الأنشطة الطلابية وتطوير الخدمات الأكاديمية داخل الكلية.");
        addCandidate("سارة محمود", "الفرقة الثالثة (حاسبات) - هدفي تمكين الطالبات وزيادة فرص المشاركة في البرامج التكنولوجية.");
        addCandidate("علي خالد", "الفرقة الرابعة (كهرباء) - أؤمن بتمثيل صوت الطلاب الحقيقي والدفاع عن حقوقهم أمام الإدارة.");
    }

    function addCandidate(string memory _name, string memory _description) internal {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _description, 0);
    }

    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "لقد قمت بالتصويت مسبقا");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "مرشح غير صحيح");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    function getCandidate(uint _candidateId) public view returns (string memory, string memory, uint) {
        Candidate storage c = candidates[_candidateId];
        return (c.name, c.description, c.voteCount);
    }
}
