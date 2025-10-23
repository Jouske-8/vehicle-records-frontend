"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRoles } from "@/hooks/RolesContext";

export default function Header () {
    const roles = useRoles();
    return (
        <header className="w-full py-6 px-16 bg-white dark:bg-black border-b border-black/[.08] dark:border-white/[.145] flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
                Vehicle Records
            </h1>
            {roles?.loading ? (
                <span className="text-zinc-500">Loading roles...</span>
            ) : (
                <div className="flex items-center gap-4">
                    {roles?.isAdmin && (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
                            Admin
                        </span>
                    )}
                    {roles?.isAuditor && (
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                            Auditor
                        </span>
                    )}
                    {roles?.isDealer && (
                        <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
                            Dealer
                        </span>
                    )}
                    {roles?.isOwner && (
                        <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
                            Owner
                        </span>
                    )}
                </div>
            )}
            <ConnectButton />
        </header>
    );
}