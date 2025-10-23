"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getUserRoles } from "@/lib/userRoles";

export const RolesContext = createContext<{
  isAdmin: boolean;
  isAuditor: boolean;
  isDealer: boolean;
  isOwner: boolean;
  loading: boolean;
} | null>(null);

export const RolesProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const [roles, setRoles] = useState({
    isAdmin: false,
    isAuditor: false,
    isDealer: false,
    isOwner: false,
    loading: true,
  });

  useEffect(() => {
    const fetchRoles = async () => {
      if (!address) {
        setRoles((r) => ({ ...r, loading: false }));
        return;
      }
      const fetched = await getUserRoles(address);
      setRoles({ ...fetched, loading: false });
    };
    fetchRoles();
  }, [address]);

  return (
    <RolesContext.Provider value={roles}>{children}</RolesContext.Provider>
  );
};

export const useRoles = () => useContext(RolesContext);
