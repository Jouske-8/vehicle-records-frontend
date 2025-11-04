"use client";

import { useEffect, useState } from "react";
import { getPublicClient } from "@/utils/publicClient";

// ... (Interface definitions remain the same) ...
interface TxRecord {
  txHash: `0x${string}`;
  blockNumber: number;
  owner?: string;
  requester?: string;
  role?: string;
  timestamp?: string;
}

interface EnrichedTx extends TxRecord {
  validator: string;
  gasUsed: string;
  gasLimit: string;
  gasPrice: string;
  explorerUrl: string;
}

interface BlockDetails {
  hash: string;
  parentHash: string;
  miner: string;
  gasUsed: string;
  gasLimit: string;
  size?: string;
  nonce?: string;
  timestamp: string;
  txCount: number;
}

type ExplorerMode = "vehicle" | "role";

export default function ExplorePage() {
  const [mode, setMode] = useState<ExplorerMode>("vehicle");
  const [transactions, setTransactions] = useState<EnrichedTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const [blockDetails, setBlockDetails] = useState<Record<number, BlockDetails>>(
    {}
  );
  const publicClient = getPublicClient();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setExpandedBlock(null);
      setBlockDetails({});
      try {
        const baseUrl =
          mode === "vehicle"
            ? "http://localhost:4000/api/vehicle-events"
            : "http://localhost:4000/api/role-events";

        const [req, app, den] = await Promise.all([
          fetch(`${baseUrl}/requested`).then((r) => r.json()),
          fetch(`${baseUrl}/approved`).then((r) => r.json()),
          fetch(`${baseUrl}/denied`).then((r) => r.json()),
        ]);

        const allTxs: TxRecord[] = [...req, ...app, ...den]
          .filter((tx) => tx.txHash)
          .sort((a, b) => a.blockNumber - b.blockNumber);

        const enriched = await Promise.all(
          allTxs.map(async (tx) => {
            try {
              const receipt = await publicClient.getTransactionReceipt({
                hash: tx.txHash,
              });
              const transaction = await publicClient.getTransaction({
                hash: tx.txHash,
              });
              const block = await publicClient.getBlock({
                blockNumber: receipt.blockNumber,
              });

              return {
                ...tx,
                validator: block.miner || "N/A",
                gasUsed: receipt.gasUsed.toString(),
                gasLimit: transaction.gas.toString(),
                gasPrice: transaction.gasPrice?.toString() ?? "N/A",
                explorerUrl: `https://sepolia.etherscan.io/tx/${tx.txHash}`,
                timestamp: new Date(
                  Number(block.timestamp) * 1000
                ).toLocaleString(),
              };
            } catch {
              return {
                ...tx,
                validator: "N/A",
                gasUsed: "N/A",
                gasLimit: "N/A",
                gasPrice: "N/A",
                explorerUrl: "",
                timestamp: tx.timestamp ?? "N/A",
              };
            }
          })
        );

        setTransactions(enriched);
      } catch (err) {
        console.error("Error loading transactions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [mode, publicClient]); // Added publicClient to dependency array

  const contractAddress =
    mode === "vehicle"
      ? "0x8db750d599cdcd647d79d74baf0dc0a84fccee8e"
      : "0xc5F4DE9938a519489e51D1d2a9B64610244901a3";

  async function toggleBlockDetails(blockNumber: number) {
    if (expandedBlock === blockNumber) {
      setExpandedBlock(null);
      return;
    }

    if (!blockDetails[blockNumber]) {
      try {
        const block = await publicClient.getBlock({
          blockNumber: BigInt(blockNumber),
        });
        setBlockDetails((prev) => ({
          ...prev,
          [blockNumber]: {
            hash: block.hash,
            parentHash: block.parentHash,
            miner: block.miner || "N/A",
            gasUsed: block.gasUsed.toString(),
            gasLimit: block.gasLimit.toString(),
            size: block.size?.toString(),
            nonce: block.nonce?.toString(),
            timestamp: new Date(
              Number(block.timestamp) * 1000
            ).toLocaleString(),
            txCount: block.transactions.length,
          },
        }));
      } catch (e) {
        console.error("Failed to fetch block details:", e);
      }
    }
    setExpandedBlock(blockNumber);
  }

  return (
    // Dark gradient background for the entire page
    <main className="w-full min-h-screen flex flex-col items-center gap-6 p-4 pt-24 sm:p-8 sm:pt-24 bg-gradient-to-br from-gray-900 to-black text-gray-100">
      
      {/* Main Glassmorphism Container */}
      <div
        className="w-full max-w-7xl flex flex-col gap-4 p-4 sm:p-6 
                   rounded-2xl 
                   border border-gray-500/30 
                   bg-white/10 
                   backdrop-blur-lg 
                   shadow-xl"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          
          {/* Title with the blue-cyan-green gradient */}
          <h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300 text-center sm:text-left">
            {mode === "vehicle"
              ? "🚗 Vehicle Contract Explorer"
              : "👤 Role Contract Explorer"}
          </h1>
          
          {/* Themed toggle buttons */}
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                mode === "vehicle"
                  ? "text-gray-900 font-semibold bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300"
                  : "text-gray-200 bg-gray-700/50 border border-gray-500/50 hover:bg-gray-700/70"
              }`}
              onClick={() => setMode("vehicle")}
            >
              Vehicle
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                mode === "role"
                  ? "text-gray-900 font-semibold bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300"
                  : "text-gray-200 bg-gray-700/50 border border-gray-500/50 hover:bg-gray-700/70"
              }`}
              onClick={() => setMode("role")}
            >
              Role
            </button>
          </div>
        </div>

        {/* Contract address, themed for dark mode */}
        <p className="text-gray-300 mb-4 text-center sm:text-left">
          Monitoring Contract:{" "}
          <code className="bg-gray-900/50 text-cyan-300 p-1 rounded-md text-xs">
            {contractAddress}
          </code>
        </p>

        {loading ? (
          <p className="text-gray-300 text-center p-8">
            Fetching blockchain data...
          </p>
        ) : (
          // Themed table container
          <div className="overflow-x-auto border border-gray-500/30 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-900/60 text-left text-gray-200">
                <tr>
                  <th className="px-4 py-3">Block</th>
                  <th className="px-4 py-3">Tx Hash</th>
                  <th className="px-4 py-3">
                    {mode === "role" ? "Requester / Role" : "Owner / Requester"}
                  </th>
                  <th className="px-4 py-3">Validator</th>
                  <th className="px-4 py-3">Gas (Used / Limit)</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                {transactions.map((tx) => (
                  <>
                    <tr
                      key={tx.txHash}
                      className="border-t border-gray-500/30 hover:bg-white/10"
                    >
                      <td className="px-4 py-2">{tx.blockNumber}</td>
                      <td className="px-4 py-2 truncate max-w-[10rem] text-cyan-300">
                        {tx.txHash.slice(0, 10)}...
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {mode === "vehicle"
                          ? tx.owner || tx.requester || "—"
                          : `${tx.requester || "—"} (${tx.role || "?"})`}
                      </td>
                      <td className="px-4 py-2 text-gray-300 truncate max-w-[10rem]">
                        {tx.validator}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {tx.gasUsed} / {tx.gasLimit}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {tx.timestamp}
                      </td>
                      <td className="px-4 py-2 space-x-3">
                        <a
                          href={tx.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 hover:underline"
                        >
                          Etherscan →
                        </a>
                        <button
                          onClick={() => toggleBlockDetails(tx.blockNumber)}
                          className="text-green-300 hover:text-green-200 hover:underline"
                        >
                          {expandedBlock === tx.blockNumber
                            ? "Hide Details"
                            : "View Block"}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Themed expanded row */}
                    {expandedBlock === tx.blockNumber &&
                      blockDetails[tx.blockNumber] && (
                        <tr className="bg-gray-900/40 border-t border-gray-500/30">
                          <td
                            colSpan={7}
                            className="px-6 py-4 text-sm text-gray-300"
                          >
                            <h3 className="font-semibold text-gray-100 mb-2">
                              Block #{tx.blockNumber} Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 break-all">
                              <p>
                                <strong className="text-gray-200">Block Hash:</strong>{" "}
                                {blockDetails[tx.blockNumber].hash}
                              </p>
                              <p>
                                <strong className="text-gray-200">Parent Hash:</strong>{" "}
                                {blockDetails[tx.blockNumber].parentHash}
                              </p>
                              <p>
                                <strong className="text-gray-200">Validator:</strong>{" "}
                                {blockDetails[tx.blockNumber].miner}
                              </p>
                              <p>
                                <strong className="text-gray-200">Timestamp:</strong>{" "}
                                {blockDetails[tx.blockNumber].timestamp}
                              </p>
                              <p>
                                <strong className="text-gray-200">Gas Used / Limit:</strong>{" "}
                                {blockDetails[tx.blockNumber].gasUsed} /{" "}
                                {blockDetails[tx.blockNumber].gasLimit}
                              </p>
                              <p>
                                <strong className="text-gray-200">Transactions:</strong>{" "}
                                {blockDetails[tx.blockNumber].txCount}
                              </p>
                              <p>
                                <strong className="text-gray-200">Block Size:</strong>{" "}
                                {blockDetails[tx.blockNumber].size || "N/A"}{" "}
                                bytes
                              </p>
                              <p>
                                <strong className="text-gray-200">Nonce:</strong>{" "}
                                {blockDetails[tx.blockNumber].nonce || "N/A"}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}