"use client";

import {
	TrendingUp,
	Info,
	CheckCheck,
	TriangleAlert,
	SlidersHorizontal,
	RefreshCw,
	Share2,
} from "lucide-react";

function CatLogoSmall() {
	return (
		<svg
			width={18.4}
			height={18.4}
			viewBox="0 0 20 20"
			fill="none"
			className="shrink-0 text-[#E4E4E4]"
		>
			<path
				d="M10 2c-1.5 0-2.5 1-3 2.5-.5 1.5 0 3 1 4s2.5 1.5 4 1.5 3-.5 4-1.5 1.5-2.5 1-4C12.5 3 11.5 2 10 2z"
				fill="currentColor"
			/>
			<ellipse cx="7" cy="8" rx="1.2" ry="1.5" fill="currentColor" />
			<ellipse cx="13" cy="8" rx="1.2" ry="1.5" fill="currentColor" />
		</svg>
	);
}

const picks = [
	{
		icon: TrendingUp,
		color: "#34C759",
		text: "Solana ecosystem showing strong momentum today. Trading volume up 34% across monitored tokens",
	},
	{
		icon: Info,
		color: "#0088FF",
		text: "BONK showing accumulation patterns. May be worth increasing position size.",
	},
	{
		icon: CheckCheck,
		color: "#CB30E0",
		text: "Solana ecosystem showing strong momentum today. Trading volume up 34% across monitored tokens",
	},
	{
		icon: TriangleAlert,
		color: "#FF8D28",
		text: "Your exposure to high-risk tokens is above your preferred 15% threshold. Consider...",
	},
];

export function QuickPicksPanel() {
	return (
		<div className="flex flex-1 flex-col gap-6 border border-[#1E1E1E] p-6">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<CatLogoSmall />
					<span
						className="text-xs leading-4 text-[#E4E4E4]"
						style={{
							fontFamily:
								"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
						}}
					>
						Quick picks by Autonomi
					</span>
					<SlidersHorizontal
						className="h-4 w-4 shrink-0 text-white"
						strokeWidth={1}
					/>
				</div>
			</div>
			<div className="flex max-h-[215px] flex-1 flex-col gap-6 overflow-y-auto">
				{picks.map((pick, i) => {
					const Icon = pick.icon;
					return (
						<div key={i} className="flex items-start gap-2.5">
							<Icon
								className="mt-0.5 h-4 w-4 shrink-0"
								style={{ color: pick.color }}
								strokeWidth={1.2}
							/>
							<span
								className="text-sm leading-[18px]"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
									fontWeight: 200,
									background:
										"linear-gradient(90deg, #FAFAFA 0%, #949494 57.69%)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									backgroundClip: "text",
								}}
							>
								{pick.text}
							</span>
						</div>
					);
				})}
			</div>
			<div className="flex gap-6">
				<button
					type="button"
					className="flex items-center justify-center gap-2 border border-[#1E1E1E] bg-[#0B0B0B] px-3 py-3.5 text-xs leading-4 text-white transition-colors hover:bg-[#141414]"
					style={{
						fontFamily:
							"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
					}}
				>
					<RefreshCw className="h-4 w-4" strokeWidth={1.1} />
					Refresh Picks
				</button>
				<button
					type="button"
					className="flex items-center justify-center gap-2 bg-[#131313] px-3 py-3.5 text-xs leading-4 text-white transition-colors hover:bg-[#1a1a1a]"
					style={{
						fontFamily:
							"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
					}}
				>
					<Share2 className="h-4 w-4" strokeWidth={1.1} />
					Discuss Each
				</button>
			</div>
		</div>
	);
}
