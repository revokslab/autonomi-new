"use client";

import { LayoutGrid, Wallet, Bot, Briefcase, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
	{ href: "#", icon: Wallet, label: "Wallet" },
	{ href: "#", icon: Bot, label: "AI" },
	{ href: "/dashboard/portfolio", icon: Briefcase, label: "Portfolio" },
	{ href: "#", icon: Zap, label: "Actions" },
];

export function Sidebar() {
	const pathname = usePathname();
	return (
		<aside className="fixed left-0 top-0 z-30 flex h-screen w-[86px] flex-col border-r border-[#1E1E1E] bg-[#0B0B0B]">
			<div className="flex h-[77px] shrink-0 items-center justify-center border-b border-[#1E1E1E] px-6">
				<Image
					src="/logo.svg"
					alt="Logo"
					width={20}
					height={20}
					className="shrink-0"
				/>
			</div>
			<nav className="flex flex-1 flex-col gap-3 p-6">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.label}
							href={item.href}
							className={`flex h-10 w-10 items-center justify-center transition-colors ${
								isActive
									? "border border-[#1E1E1E] bg-[#141414] text-white"
									: "text-[#494949] hover:text-[#8A8A8A]"
							}`}
							aria-label={item.label}
						>
							<Icon className="h-[14px] w-[14px]" strokeWidth={1.5} />
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
