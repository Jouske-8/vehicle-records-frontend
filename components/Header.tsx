import { ConnectButton } from "@rainbow-me/rainbowkit";
import DisplayRoles  from "@/components/DisplayRoles"
export default function Header () {
    return (
        <header className="w-full py-6 px-16 bg-white dark:bg-black border-b border-black/[.08] dark:border-white/[.145] flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
                Vehicle Records
            </h1>
            <DisplayRoles />
            <ConnectButton />
        </header>
    );
}