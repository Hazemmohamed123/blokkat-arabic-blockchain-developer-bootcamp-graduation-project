"use client";

import { useState, useEffect } from "react";
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";
import { contractAddress } from "../constants";
import abi from "../abi/StudentVote.json";

export default function Voting() {
  const { address, isConnected } = useAccount();
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  // Get current results
  const { data: results, refetch } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getResults",
    watch: true,
  });

  // Check if user already voted
  const { data: voted } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "hasVoted",
    args: [address],
    enabled: !!address,
  });

  useEffect(() => {
    if (voted) setHasVoted(true);
  }, [voted]);

  // Write vote
  const { data: writeData, write } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "vote",
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess() {
      refetch();
      setHasVoted(true);
    },
  });

  const handleVote = () => {
    if (!selectedCandidate) return alert("اختر مرشحًا أولاً");
    write({ args: [parseInt(selectedCandidate)] });
  };

  const candidateNames = ["محمد أحمد", "سارة محمود", "علي خالد"];

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">👑 انتخابات رئيس اتحاد الطلاب</h2>

      {!isConnected ? (
        <p className="text-red-500">من فضلك قم بتوصيل محفظتك</p>
      ) : hasVoted ? (
        <div>
          <h3 className="mb-2">📊 لقد قمت بالتصويت! النتائج الحالية:</h3>
          {results &&
            results.map((votes, index) => (
              <div key={index} className="mb-2">
                <strong>{candidateNames[index]}:</strong>{" "}
                {"█".repeat(Number(votes))} ({Number(votes)} صوت)
              </div>
            ))}
        </div>
      ) : (
        <div>
          <p className="mb-2">اختر أحد المرشحين:</p>
          {candidateNames.map((name, idx) => (
            <div key={idx}>
              <input
                type="radio"
                name="candidate"
                value={idx}
                onChange={(e) => setSelectedCandidate(e.target.value)}
              />{" "}
              {name}
            </div>
          ))}

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleVote}
            disabled={isConfirming}
          >
            {isConfirming ? "جاري تأكيد التصويت..." : "✅ تأكيد التصويت"}
          </button>
        </div>
      )}
    </div>
  );
}
