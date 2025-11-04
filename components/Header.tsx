"use client";

import React from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit"; // Mocked below
import DisplayRoles from "@/components/DisplayRoles"; // Mocked below

/**
 * Mock Component for RainbowKit's ConnectButton
 * Styled to look like a modern "Connect Wallet" button
 */
function MockConnectButton() {
  return (
    <button className="
      flex items-center space-x-2 rounded-xl 
      bg-gradient-to-r from-blue-500 to-purple-600 
      px-4 py-2.5 
      font-semibold text-white 
      transition-all duration-300 ease-in-out
      hover:from-blue-600 hover:to-purple-700
      hover:shadow-lg hover:shadow-blue-500/20
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
    ">
      {/* Inline SVG for Wallet Icon */}
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      <span>Connect Wallet</span>
    </button>
  );
}

/**
 * Mock Component for DisplayRoles
 * Styled to look like a status "tag" or "badge"
 */
function MockDisplayRoles() {
  // Simulating an "Admin" role for visual preview
  return (
    <div className="
      hidden items-center space-x-2 
      rounded-full 
      border border-white/10 
      bg-gray-800/50 
      px-4 py-2 
      text-sm font-medium text-gray-300
      sm:flex
    ">
      {/* Inline SVG for Shield/Role Icon */}
      <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <span>Admin</span>
    </div>
  );
}

/**
 * Main Header Component
 * Redesigned with a sticky, glassmorphism "web3" UI
 */
export default function Header() {
  return (
    <header className="
      fixed top-0 left-0 w-full z-50 
      flex items-center justify-between 
      py-4 px-6 sm:px-16 
      border-b border-white/10 
      bg-gray-950/70 backdrop-blur-lg
    ">
      
      {/* Logo and Title Section */}
      <div className="flex items-center space-x-3">
        {/* Inline SVG for Car Icon */}
        <svg className="h-8 w-8 text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 16.94v.01c0 .53.43.95.95.95h.1c.53 0 .95-.43.95-.95v-.01c0-.53-.43-.95-.95-.95h-.1c-.53 0-.95.43-.95.95Z"/>
          <path d="M5 16.94v.01c0 .53.43.95.95.95h.1c.53 0 .95-.43.95-.95v-.01c0-.53-.43-.95-.95-.95h-.1c-.53 0-.95.43-.95.95Z"/>
          <path d="M2 12c0-2.8.9-5.3 2.4-7.3C5.1 3.5 6.4 2.6 8 2.1 9.6 1.6 11.3 1.3 13 1.3s3.4.3 5 1c1.6.5 2.9 1.4 3.6 2.6C23.1 6.7 24 9.2 24 12v3.6c0 1.2-.4 2.3-1.2 3.1-.8.8-1.9 1.2-3.1 1.2h-1.4c-1.2 0-2.3-.4-3.1-1.2-.8-.8-1.2-1.9-1.2-3.1v-.1c-1.1.2-2.2.3-3.3.3s-2.2-.1-3.3-.3v.1c0 1.2-.4 2.3-1.2 3.1-.8.8-1.9 1.2-3.1 1.2H4.2c-1.2 0-2.3-.4-3.1-1.2C.4 17.9 0 16.8 0 15.6V12Z"/>
          <path d="M15.2 6.5H8.8L5.1 12.8"/>
        </svg>
        <h1 className="
          text-2xl font-semibold 
          bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300
        ">
          Vehicle Records
        </h1>
      </div>
      
      {/* Right-side Controls */}
      <div className="flex items-center space-x-4">
        <DisplayRoles />
        <ConnectButton/>
      </div>
      
    </header>
  );
}
