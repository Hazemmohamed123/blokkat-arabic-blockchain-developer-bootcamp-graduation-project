import React, { useEffect, useState } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const contractAbi = [
  "function candidatesCount() view returns (uint256)",
  "function candidates(uint256) view returns (uint256, string memory, string memory, uint256)",
  "function vote(uint256)",
  "function hasVoted(address) view returns (bool)",
  "event Voted(address indexed voter, uint256 candidateId)",
];

export default function Voting() {
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const contract = useContract({
    address: contractAddress,
    abi: contractAbi,
    signerOrProvider: signer || provider,
  });

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [txHash, setTxHash] = useState(null);

  useEffect(() => {
    if (!contract) return;

    async function fetchCandidates() {
      const count = await contract.candidatesCount();
      const candidatesList = [];
      for (let i = 1; i <= count; i++) {
        const candidate = await contract.candidates(i);
        candidatesList.push({
          id: candidate[0].toNumber(),
          name: candidate[1],
          description: candidate[2],
          votes: candidate[3].toNumber(),
        });
      }
      setCandidates(candidatesList);
    }

    async function checkVote() {
      if (!address) return;
      const voted = await contract.hasVoted(address);
      setHasVoted(voted);
    }

    fetchCandidates();
    checkVote();
  }, [contract, address]);

  async function handleVote() {
    if (!selectedCandidate) {
      alert("اختر مرشحًا من فضلك");
      return;
    }
    setIsVoting(true);
    try {
      const tx = await contract.vote(selectedCandidate);
      setTxHash(tx.hash);
      await tx.wait();
      // Refresh data
      const count = await contract.candidatesCount();
      const candidatesList = [];
      for (let i = 1; i <= count; i++) {
        const candidate = await contract.candidates(i);
        candidatesList.push({
          id: candidate[0].toNumber(),
          name: candidate[1],
          description: candidate[2],
          votes: candidate[3].toNumber(),
        });
      }
      setCandidates(candidatesList);
      setHasVoted(true);
    } catch (error) {
      alert(error.message);
    }
    setIsVoting(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>انتخابات رئيس اتحاد الطلاب</h2>
      {isConnected ? (
        <>
          {hasVoted ? (
            <p>لقد قمت بالتصويت. شكراً لمشاركتك!</p>
          ) : (
            <>
              <h3>المرشحون:</h3>
              <ul>
                {candidates.map((c) => (
                  <li key={c.id}>
                    <label>
                      <input
                        type="radio"
                        name="candidate"
                        value={c.id}
                        onChange={() => setSelectedCandidate(c.id)}
                      />
                      <strong>{c.name}</strong>: {c.description} (عدد الأصوات:{" "}
                      {c.votes})
                    </label>
                  </li>
                ))}
              </ul>
              <button onClick={handleVote} disabled={isVoting}>
                {isVoting ? "جارٍ التصويت..." : "صوّت الآن"}
              </button>
            </>
          )}
          {txHash && (
            <p>
              معاملة التصويت تم إرسالها:{" "}
              <a
                href={`https://sepolia.scrollscan.com/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                عرض على ScrollSepolia Explorer
              </a>
            </p>
          )}
        </>
      ) : (
        <p>يرجى توصيل محفظة MetaMask لبدء التصويت.</p>
      )}
    </div>
  );
}
