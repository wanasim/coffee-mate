"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { type Address, parseEther } from "viem";
import { useState, useEffect } from "react";
import FUND_ME_ABI from "../../foundry/out/FundMe.sol/FundMe.json";

if (!process.env.NEXT_PUBLIC_FUND_ME_CONTRACT_ADDRESS) {
  throw new Error(
    "Missing NEXT_PUBLIC_FUND_ME_CONTRACT_ADDRESS environment variable"
  );
}

const FUND_ME_ADDRESS = process.env
  .NEXT_PUBLIC_FUND_ME_CONTRACT_ADDRESS as `0x${string}`;

export default function Home() {
  const { address, isConnected } = useAccount();

  const { data: balance, refetch: refetchBalance } =
    useBalance({
      address: FUND_ME_ADDRESS,
    });

  const { data: funders, refetch: refetchFunders } =
    useReadContract({
      address: FUND_ME_ADDRESS,
      abi: FUND_ME_ABI.abi,
      functionName: "getFunders",
    }) as { data: Address[]; refetch: () => void };

  const { data: owner } = useReadContract({
    address: FUND_ME_ADDRESS,
    abi: FUND_ME_ABI.abi,
    functionName: "getOwner",
  }) as { data: Address };

  const {
    writeContract,
    isPending,
    isError,
    error,
    data: txHash,
  } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Effect to refetch data when transaction is confirmed
  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      refetchFunders();
    }
  }, [isSuccess, refetchBalance, refetchFunders]);

  const handleFund = async () => {
    try {
      await writeContract({
        address: FUND_ME_ADDRESS,
        abi: FUND_ME_ABI.abi,
        functionName: "fund",
        value: parseEther("0.1"),
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleWithdraw = async () => {
    await writeContract({
      address: FUND_ME_ADDRESS,
      abi: FUND_ME_ABI.abi,
      functionName: "withdraw",
    });
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
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleFund}
                  disabled={isPending || isConfirming}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending
                    ? "Sending..."
                    : isConfirming
                    ? "Confirming..."
                    : "Fund 0.1 ETH"}
                </button>
                {owner === address && (
                  <button
                    type="button"
                    disabled={isPending || isConfirming}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    onClick={handleWithdraw}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>

            <div>
              Balance is: {balance?.value.toString()}
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
