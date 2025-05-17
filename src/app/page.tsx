"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { type Address, parseEther } from "viem";
import FUND_ME_ABI from "../../foundry/out/FundMe.sol/FundMe.json";

// FundMe contract ABI (you'll need to replace this with your actual contract ABI)
// const FUND_ME_ABI = [
//   {
//     inputs: [],
//     name: "fund",
//     outputs: [],
//     stateMutability: "payable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getFunders",
//     outputs: [{ name: "", type: "address[]" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getOwner",
//     outputs: [{ name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
// ] as const;

if (!process.env.NEXT_PUBLIC_FUND_ME_CONTRACT_ADDRESS) {
  throw new Error(
    "Missing NEXT_PUBLIC_FUND_ME_CONTRACT_ADDRESS environment variable"
  );
}

const FUND_ME_ADDRESS = process.env
  .NEXT_PUBLIC_FUND_ME_CONTRACT_ADDRESS as `0x${string}`;

export default function Home() {
  const { address, isConnected } = useAccount();

  const balance = useBalance({ address: FUND_ME_ADDRESS });

  const { data: funders } = useReadContract({
    address: FUND_ME_ADDRESS,
    abi: FUND_ME_ABI.abi,
    functionName: "getFunders",
  }) as { data: Address[] };

  const { writeContract, isPending, isError, error } =
    useWriteContract();

  const handleFund = async () => {
    try {
      const result = await writeContract({
        address: FUND_ME_ADDRESS,
        abi: FUND_ME_ABI.abi,
        functionName: "fund",
        value: parseEther("0.1"),
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Coffee Mate
          </h1>
          <ConnectButton />
        </div>

        {isConnected && (
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Buy me a coffee!
              </h2>
              <p className="mb-4">
                Support this project by buying me a coffee
                for 0.1 ETH
              </p>
              <button
                type="button"
                onClick={handleFund}
                disabled={isPending}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? "Sending..." : "Fund 0.1 ETH"}
              </button>
            </div>

            <div>
              Balance is: {balance.data?.value.toString()}
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Funders
              </h2>
              {funders && funders.length > 0 ? (
                <ul className="space-y-2">
                  {funders.map((funder) => (
                    <li key={funder} className="text-sm">
                      {funder}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No funders yet. Be the first one!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
