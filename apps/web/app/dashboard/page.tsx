"use client";

import { LayoutGrid, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { AIInputBox } from "@/components/dashboard/AIInputBox";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PortfolioPanel } from "@/components/dashboard/PortfolioPanel";
import { QuickActionsBar } from "@/components/dashboard/QuickActionsBar";
import { QuickPicksPanel } from "@/components/dashboard/QuickPicksPanel";

const metrics = [
	{
		title: "Users",
		value: "20.8k",
		change: 12,
		changeLabel: "vs last mth",
		trend: "down" as const,
	},
	{
		title: "Revenue",
		value: "12.4k",
		change: 8,
		changeLabel: "vs last mth",
		trend: "up" as const,
	},
	{
		title: "Conversions",
		value: "1.2k",
		change: 15,
		changeLabel: "vs last mth",
		trend: "down" as const,
	},
	{
		title: "Engagement",
		value: "48%",
		change: 6,
		changeLabel: "vs last mth",
		trend: "up" as const,
	},
];

export default function DashboardPage() {
	const [aiInputValue, setAiInputValue] = useState("");

	return (
		<>
			<Header />
			<section className="flex flex-row justify-between gap-6 px-6">
				<div className="flex flex-col gap-2">
					<p
						className="font-['Hedvig_Serif',serif] text-base leading-[21px] text-white"
						style={{
							fontFamily:
								"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
						}}
					>
						Afternoon <span className="text-[#494949]">Patrick,</span>
					</p>
					<p
						className="text-xs leading-4 text-[#494949]"
						style={{
							fontFamily:
								"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							fontWeight: 300,
						}}
					>
						Here is a quick snap of your finances
					</p>
				</div>
				<div className="flex items-center gap-2.5">
					<button
						type="button"
						className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#1E1E1E] bg-[#0B0B0B] text-white transition-colors hover:bg-[#141414]"
						aria-label="Grid view"
					>
						<LayoutGrid className="h-3.5 w-3.5" strokeWidth={1} />
					</button>
					<button
						type="button"
						className="flex h-11 items-center gap-2.5 border border-[#1E1E1E] bg-[#0B0B0B] px-3 py-2 font-mono text-sm leading-[18px] text-white transition-colors hover:bg-[#141414]"
						style={{ fontFamily: "var(--font-geist-mono), monospace" }}
					>
						<SlidersHorizontal
							className="h-3.5 w-3.5 shrink-0"
							strokeWidth={1}
						/>
						1 Year
					</button>
					<div className="flex items-stretch border border-[#1E1E1E] [&>button]:border-r [&>button]:border-[#1E1E1E] [&>button:last-child]:border-r-0">
						<button
							type="button"
							className="h-11 border-r border-[#1E1E1E] bg-[#0A0A0A] px-6 py-3.5 text-sm leading-5 text-white transition-colors"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							Overview
						</button>
						<button
							type="button"
							className="h-11 bg-[#0B0B0B] px-6 py-3.5 text-sm leading-5 text-[#8A8A8A] transition-colors hover:text-[#B2B2B2]"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							Activity
						</button>
					</div>
				</div>
			</section>
			<section className="px-6">
				<div className="flex flex-row gap-6">
					{metrics.map((m) => (
						<MetricCard
							key={m.title}
							title={m.title}
							value={m.value}
							change={m.change}
							changeLabel={m.changeLabel}
							trend={m.trend}
						/>
					))}
				</div>
			</section>
			<section className="flex min-h-[373px] flex-1 flex-row gap-6 px-6">
				<QuickPicksPanel />
				<PortfolioPanel />
			</section>
			<QuickActionsBar onActionClick={setAiInputValue} />
			<AIInputBox value={aiInputValue} onChange={setAiInputValue} />
		</>
	);
}
