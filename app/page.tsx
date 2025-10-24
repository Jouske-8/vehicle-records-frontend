"use client";
import { useRoles } from "@/hooks/RolesContext";
import Link from "next/link";

export default function Home() {
  const roles = useRoles();
  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Link href="/user" className="mb-8 rounded-lg bg-blue-600 px-6 py-4 text-white hover:bg-blue-700">
          Go to User Page
        </Link>
        {roles?.isAdmin && (
          <Link href="/admin" className="mb-8 rounded-lg bg-red-600 px-6 py-4 text-white hover:bg-red-700">
            Go to Admin Page
          </Link>
        )}
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Welcome to Vehicle Records
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          This is the home page. Use the links above to navigate to different sections based on your roles.
        </p>
      </main>
    </div>
  );
}
