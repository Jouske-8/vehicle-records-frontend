"use client";
import { ComponentType } from "react";

// import { useRoles } from "@/hooks/RolesContext"; // Removed: Cannot be resolved in this environment
// import Link from "next/link"; // Removed: Cannot be resolved in this environment
// We'll use lucide-react for icons, a common choice in modern React apps
import {
  User,
  ShieldCheck,
  KeyRound,
  SearchCode,
  Car,
  Shield,
} from "lucide-react";

interface DashboardCardProps {
  href: string;
  icon: ComponentType<{ className?: string }>; // <— Icon prop type
  title: string;
  description: string;
  className?: string;
}

/**
 * A reusable, styled card component for dashboard navigation links.
 * We define it here to keep everything in one file.
 */
function DashboardCard({ href, icon: Icon, title, description, className = "" }) {
  return (
    <a // Changed from Link to a
      href={href}
      className={`
        group relative block overflow-hidden rounded-xl border border-white/10 
        bg-gray-800/30 p-6 backdrop-blur-md transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:border-blue-400/50 hover:bg-gray-700/50
        ${className}
      `}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute top-0 left-0 h-full w-full bg-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div 
          className="
            mb-4 inline-flex h-12 w-12 items-center justify-center 
            rounded-lg border border-blue-500/30 bg-blue-900/20 
            text-blue-400 transition-colors duration-300 group-hover:bg-blue-900/40
          "
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-300">{description}</p>
      </div>
    </a> // Changed from Link to a
  );
}

export default function Home() {
  // const roles = useRoles();
  // Mock roles data for preview, as the hook is not available in this environment
  const roles = { isAdmin: true, isAuditor: true };


  return (
    // Main container with dark, "web3" style background
    <div className="relative flex min-h-screen w-full items-start justify-center overflow-hidden bg-gray-950 font-sans text-white">
      {/* Background dot grid */}
      <div className="absolute inset-0 -z-20 h-full w-full bg-transparent bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Background glow effect */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-blue-700/20 opacity-50 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[20rem] w-[40rem] rounded-full bg-purple-700/15 opacity-40 blur-[100px]" />


      <main className="z-10 w-full max-w-5xl flex-col items-center py-24 px-4 sm:py-32 sm:px-8">
        {/* Extra Component: Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative rounded-full bg-gray-800/50 p-4 border border-white/10 backdrop-blur-md">
            <Car className="h-10 w-10 text-blue-300" />
            <Shield className="absolute -top-2 -right-2 h-5 w-5 rounded-full border border-gray-950 bg-gray-800 text-green-400" />
          </div>
        </div>

        {/* Hero Text Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300">
            Vehicle Records Portal
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-300">
            Secure, transparent, and decentralized. Manage your vehicle history
            on the blockchain.
          </p>
        </div>

        {/* Navigation Card Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            href="/user"
            icon={User}
            title="User Dashboard"
            description="View and manage your personal vehicle records."
          />

          <DashboardCard
            href="/explorer"
            icon={SearchCode}
            title="Block Explorer"
            description="Browse transactions and data on the blockchain."
          />

          {(roles?.isAdmin || roles?.isAuditor) && (
            <DashboardCard
              href="/admin"
              icon={ShieldCheck}
              title="Audit Dashboard"
              description="Access audit logs and compliance reports."
              className="sm:col-span-1" // Fills the grid nicely
            />
          )}

          {roles?.isAdmin && (
            <DashboardCard
              href="/roles"
              icon={KeyRound}
              title="Roles Management"
              description="Configure user roles and platform permissions."
              className="sm:col-span-2 lg:col-span-1" // Adjust span for different layouts
            />
          )}
        </div>
      </main>
    </div>
  );
}

