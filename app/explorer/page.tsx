"use client";

import { useEffect, useState } from "react";
import { getPublicClient } from "@/utils/publicClient";

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
  const [blockDetails, setBlockDetails] = useState<Record<number, BlockDetails>>({});
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
  }, [mode]);

  const contractAddress =
    mode === "vehicle"
      ? "0x8db750d599cdcd647d79d74baf0dc0a84fccee8e"
      : "0xc5F4DE9938a519489e51D1d2a9B64610244901a3";

  async function toggleBlockDetails(blockNumber: number) {
    if (expandedBlock === blockNumber) {
      setExpandedBlock(null);
      return;
    }

    // Fetch block details only once
    if (!blockDetails[blockNumber]) {
      try {
        const block = await publicClient.getBlock({ blockNumber: BigInt(blockNumber) });
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
            timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {mode === "vehicle"
            ? "🚗 Vehicle Contract Explorer"
            : "👤 Role Contract Explorer"}
        </h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              mode === "vehicle"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setMode("vehicle")}
          >
            Vehicle
          </button>
          <button
            className={`px-4 py-2 rounded ${
              mode === "role"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setMode("role")}
          >
            Role
          </button>
        </div>
      </div>

      <p className="text-gray-500 mb-6">
        Monitoring Contract Address: <code>{contractAddress}</code>
      </p>

      {loading ? (
        <p className="text-gray-500">Fetching blockchain data...</p>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Block</th>
                <th className="px-4 py-2">Tx Hash</th>
                <th className="px-4 py-2">
                  {mode === "role" ? "Requester / Role" : "Owner / Requester"}
                </th>
                <th className="px-4 py-2">Validator</th>
                <th className="px-4 py-2">Gas (Used / Limit)</th>
                <th className="px-4 py-2">Timestamp</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <>
                  <tr key={tx.txHash} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{tx.blockNumber}</td>
                    <td className="px-4 py-2 truncate max-w-[10rem] text-blue-600">
                      {tx.txHash.slice(0, 10)}...
                    </td>
                    <td className="px-4 py-2">
                      {mode === "vehicle"
                        ? tx.owner || tx.requester || "—"
                        : `${tx.requester || "—"} (${tx.role || "?"})`}
                    </td>
                    <td className="px-4 py-2">{tx.validator}</td>
                    <td className="px-4 py-2">
                      {tx.gasUsed} / {tx.gasLimit}
                    </td>
                    <td className="px-4 py-2">{tx.timestamp}</td>
                    <td className="px-4 py-2 space-x-3">
                      <a
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Etherscan →
                      </a>
                      <button
                        onClick={() => toggleBlockDetails(tx.blockNumber)}
                        className="text-green-600 hover:underline"
                      >
                        {expandedBlock === tx.blockNumber
                          ? "Hide Details"
                          : "View Block"}
                      </button>
                    </td>
                  </tr>

                  {expandedBlock === tx.blockNumber && blockDetails[tx.blockNumber] && (
                    <tr className="bg-gray-50 border-t">
                      <td colSpan={7} className="px-6 py-4 text-sm text-gray-700">
                        <h3 className="font-semibold mb-2">
                          Block #{tx.blockNumber} Details
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          <p>
                            <strong>Block Hash:</strong>{" "}
                            {blockDetails[tx.blockNumber].hash}
                          </p>
                          <p>
                            <strong>Parent Hash:</strong>{" "}
                            {blockDetails[tx.blockNumber].parentHash}
                          </p>
                          <p>
                            <strong>Validator:</strong>{" "}
                            {blockDetails[tx.blockNumber].miner}
                          </p>
                          <p>
                            <strong>Timestamp:</strong>{" "}
                            {blockDetails[tx.blockNumber].timestamp}
                          </p>
                          <p>
                            <strong>Gas Used / Limit:</strong>{" "}
                            {blockDetails[tx.blockNumber].gasUsed} /{" "}
                            {blockDetails[tx.blockNumber].gasLimit}
                          </p>
                          <p>
                            <strong>Transactions:</strong>{" "}
                            {blockDetails[tx.blockNumber].txCount}
                          </p>
                          <p>
                            <strong>Block Size:</strong>{" "}
                            {blockDetails[tx.blockNumber].size || "N/A"} bytes
                          </p>
                          <p>
                            <strong>Nonce:</strong>{" "}
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
  );
}
