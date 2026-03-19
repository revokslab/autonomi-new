"use client";

import {
	LayoutGrid,
	MessageCircle,
	Bot,
	Terminal,
	Settings,
	ArrowLeftRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/dashboard", icon: LayoutGrid, label: "Overview" },
	{ href: "/dashboard/chat", icon: MessageCircle, label: "Chat" },
	{ href: "/dashboard/agents", icon: Bot, label: "Agents" },
	{ href: "/dashboard/swap", icon: ArrowLeftRight, label: "Swap" },
	{ href: "/dashboard/terminal", icon: Terminal, label: "Terminal" },
	{ href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
	const pathname = usePathname();
	return (
		<aside className="fixed left-0 top-0 z-30 flex h-screen w-[96px] flex-col border-r border-neutral-200 bg-white">
			<div className="flex h-[77px] shrink-0 items-center justify-center border-b border-neutral-200 px-6">
				<Image
					src="/logo.svg"
					alt="Logo"
					width={20}
					height={20}
					className="shrink-0 invert"
				/>
			</div>
			<nav className="flex flex-1 flex-col gap-4 p-5">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						item.href === "/dashboard"
							? pathname === "/dashboard"
							: pathname.startsWith(item.href);
					return (
						<Link
							key={item.label}
							href={item.href}
							className={`flex h-12 w-12 items-center justify-center transition-colors ${
								isActive
									? "border border-neutral-300 bg-neutral-100 text-neutral-900"
									: "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
							}`}
							aria-label={item.label}
						>
							<Icon className="h-5 w-5" strokeWidth={1.5} />
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
