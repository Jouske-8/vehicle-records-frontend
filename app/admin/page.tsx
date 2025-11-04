"use client";

import React from 'react';
import { FileSearch, UserPlus } from 'lucide-react';
import { useRoles } from "@/hooks/RolesContext";

/**
 * A reusable, styled card component for dashboard navigation links.
 */
function DashboardCard({ href, icon: Icon, title, description }) {
  return (
    <a
      href={href}
      className="
        group relative block overflow-hidden rounded-xl border border-white/10 
        bg-gray-800/40 p-6 backdrop-blur-md transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:border-blue-400/50 hover:bg-gray-700/60
      "
    >
      {/* ... (Card content remains the same) ... */}
      <div className="absolute top-0 left-0 h-full w-full bg-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div 
          className="
            mb-4 inline-flex h-12 w-12 items-center justify-center 
            rounded-lg border border-blue-600/30 bg-blue-950/30 
            text-blue-400 transition-colors duration-300 
            group-hover:bg-blue-900/50 group-hover:text-blue-300
          "
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-300">{description}</p>
      </div>
    </a>
  );
}

export default function AdminPage() {
  const { roles } = useRoles();
  return (
    // --- THIS IS THE FIX ---
    // Added `bg-gray-950` to this div. It will now have the correct dark
    // background, and the dot-grid/glow effects will sit on top of it.
    <div className="relative flex w-full flex-col items-center overflow-hidden bg-gray-950 font-sans text-white p-8 pt-20 min-h-screen">
      
      {/* Background dot grid (dimmed) */}
      <div className="absolute inset-0 -z-20 h-full w-full bg-transparent bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-blue-800/20 opacity-50 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[20rem] w-[40rem] rounded-full bg-purple-800/15 opacity-40 blur-[100px]" />

      {/* Page Content Area */}
      <main className="z-10 w-full max-w-7xl flex-col items-center">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300">
            Admin Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-gray-300">
            Welcome, Admin. Manage user requests and system roles.
          </p>
        </div>

        {/* --- Functional Admin Dashboard Cards --- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <DashboardCard
            href="/admin/reg-requests"
            icon={FileSearch}
            title="Registration Requests"
            description="Approve or deny new vehicle registration submissions."
          />
          {
            roles?.isAdmin &&
              <DashboardCard
              href="/admin/role-requests"
              icon={UserPlus}
              title="Role Requests"
              description="Grant or revoke roles like Dealer, Auditor, or Owner."
              />
          }

        </div>
      </main>
    </div>
  );
}