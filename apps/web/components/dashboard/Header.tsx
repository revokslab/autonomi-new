"use client";

import { Search, Bell } from "lucide-react";

export function Header() {
	return (
		<header className="flex h-[77px] shrink-0 items-center justify-between border-b border-[#1E1E1E] px-6">
			<div className="flex flex-1 items-center gap-2.5">
				<Search
					className="h-[18px] w-[18px] shrink-0 text-[#494949]"
					strokeWidth={1.5}
				/>
				<input
					type="text"
					placeholder="What do you want next?"
					className="min-w-0 flex-1 border-0 bg-transparent text-[15.68px] leading-[21px] text-[#FAFAFA] placeholder:text-[#494949] focus:outline-none focus:ring-0"
					style={{
						fontFamily:
							"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
					}}
					aria-label="Search"
				/>
			</div>
			<div className="flex items-center gap-2.5">
				<button
					type="button"
					className="flex h-9 w-[33.6px] items-center justify-center border border-[#1E1E1E] bg-[#141414] text-white transition-colors hover:bg-[#1a1a1a]"
					aria-label="Notifications"
				>
					<Bell className="h-4 w-4" strokeWidth={1.2} />
				</button>
				<div
					className="h-9 w-9 shrink-0 rounded-full bg-[#282828] flex items-center justify-center text-[#B2B2B2] text-sm font-medium"
					style={{
						fontFamily:
							"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
					}}
					role="img"
					aria-label="User avatar"
				>
					P
				</div>
			</div>
		</header>
	);
}
