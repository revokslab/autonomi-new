"use client";

import { BarChart3 } from "lucide-react";

const actions = [
	"Buy Safe Coins",
	"What's Trending?",
	"Refresh",
	"Sell Risky",
	"Emergency Sell",
	"Smart Rules",
	"What's Down?",
	"Deep Scan",
];

export function QuickActionsBar() {
	return (
		<div className="flex flex-wrap items-start gap-6 px-6">
			{actions.map((label) => (
				<button
					key={label}
					type="button"
					className="flex items-center justify-center gap-2 bg-[#131313] px-3 py-3.5 text-xs leading-4 text-white transition-colors hover:bg-[#1a1a1a]"
					style={{
						fontFamily:
							"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
					}}
				>
					<BarChart3
						className="h-4 w-4 shrink-0 text-white"
						strokeWidth={1.1}
					/>
					{label}
				</button>
			))}
		</div>
	);
}
