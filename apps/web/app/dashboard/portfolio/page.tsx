"use client";

import {
	BarChart3,
	ChevronDown,
	Copy,
	Grid3X3,
	LayoutGrid,
	Search,
	SlidersHorizontal,
	Table2,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";
import { AIInputBox } from "@/components/dashboard/AIInputBox";
import { Header } from "@/components/dashboard/Header";

const chartData = [
	{ date: "21 Jul", value: 200 },
	{ date: "22 Jul", value: 350 },
	{ date: "23 Jul", value: 280 },
	{ date: "24 Jul", value: 520 },
	{ date: "25 Jul", value: 600 },
	{ date: "26 Jul", value: 750 },
	{ date: "27 Jul", value: 1000 },
];

const timeRanges = ["24H", "1W", "1M", "1Y"] as const;
const assetTimeFilters = ["1H", "3H", "6H", "24H", "1W", "1M", "1Y"] as const;

type RiskLevel = "low" | "medium" | "high";

const riskConfig: Record<
	RiskLevel,
	{ label: string; dotColor: string; textColor: string }
> = {
	low: { label: "Low Risk", dotColor: "#17B26A", textColor: "#FAFAFA" },
	medium: { label: "Medium Risk", dotColor: "#FF8D28", textColor: "#FAFAFA" },
	high: { label: "High Risk", dotColor: "#FF383C", textColor: "#FAFAFA" },
};

const portfolioItems = [
	{
		name: "Bitcoin",
		ticker: "BTC",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "up" as const,
		risk: "low" as RiskLevel,
		iconColor: "#F7931A",
	},
	{
		name: "Ethereum",
		ticker: "ETH",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "down" as const,
		risk: "high" as RiskLevel,
		iconColor: "#627EEA",
	},
	{
		name: "Ethereum",
		ticker: "ETH",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "down" as const,
		risk: "high" as RiskLevel,
		iconColor: "#627EEA",
	},
	{
		name: "Bitcoin",
		ticker: "BTC",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "up" as const,
		risk: "low" as RiskLevel,
		iconColor: "#F7931A",
	},
	{
		name: "Ethereum",
		ticker: "ETH",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "down" as const,
		risk: "high" as RiskLevel,
		iconColor: "#627EEA",
	},
	{
		name: "Ethereum",
		ticker: "ETH",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "down" as const,
		risk: "high" as RiskLevel,
		iconColor: "#627EEA",
	},
	{
		name: "Bitcoin",
		ticker: "BTC",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "up" as const,
		risk: "low" as RiskLevel,
		iconColor: "#F7931A",
	},
	{
		name: "Solana",
		ticker: "SOL",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "down" as const,
		risk: "medium" as RiskLevel,
		iconColor: "#9945FF",
	},
	{
		name: "Solana",
		ticker: "SOL",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "down" as const,
		risk: "medium" as RiskLevel,
		iconColor: "#9945FF",
	},
	{
		name: "Bitcoin",
		ticker: "BTC",
		value: "$14,108.09",
		holdings: "20.8k",
		change: 3.42,
		trend: "up" as const,
		risk: "low" as RiskLevel,
		iconColor: "#F7931A",
	},
];

function WalletCard() {
	return (
		<div className="flex w-[392px] shrink-0 flex-col overflow-hidden rounded-none border border-[#1E1E1E] bg-[#0B0B0B] shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
			<div className="relative isolate flex flex-col gap-5 p-6">
				<div className="absolute left-1/2 top-14 z-0 h-[114px] w-[114px] -translate-x-1/2 rounded-none border-4 border-[#ABABAB] bg-[#ABABAB] opacity-30 blur-xl" />
				<div className="relative z-10 flex items-start justify-between">
					<div className="flex flex-col gap-2">
						<span
							className="text-sm leading-5 text-white"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							Wallet 1
						</span>
						<div className="flex items-center gap-1.5">
							<span
								className="text-xs leading-[18px] text-[#B2B2B2]"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								ID
							</span>
							<button
								type="button"
								className="flex items-center justify-center text-[#B2B2B2] hover:text-white"
								aria-label="Copy"
							>
								<Copy className="h-4 w-4" strokeWidth={1} />
							</button>
						</div>
					</div>
					<button
						type="button"
						className="flex h-[30px] w-[30px] items-center justify-center border border-[#1E1E1E] bg-[#141414] text-white transition-colors hover:bg-[#1a1a1a]"
						aria-label="Add"
					>
						<Grid3X3 className="h-3.5 w-3.5" strokeWidth={1} />
					</button>
				</div>
				<div className="relative z-10 flex flex-col gap-3.5">
					<div className="flex justify-center py-2.5">
						<span
							className="text-2xl leading-[43px] tracking-[-0.02em] text-[#FAFAFA]"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							$123,3891
						</span>
					</div>
					<div className="flex gap-2.5">
						<button
							type="button"
							className="flex-1 border border-[#1E1E1E] bg-[#0A0A0A] py-3.5 font-mono text-sm leading-[18px] text-white transition-colors hover:bg-[#141414]"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							Deposit
						</button>
						<button
							type="button"
							className="flex-1 border border-[#1E1E1E] bg-[#0A0A0A] py-3.5 font-mono text-sm leading-[18px] text-white transition-colors hover:bg-[#141414]"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							Swap
						</button>
						<button
							type="button"
							className="flex-1 border border-[#1E1E1E] bg-[#0A0A0A] py-3.5 font-mono text-sm leading-[18px] text-white transition-colors hover:bg-[#141414]"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							Withdraw
						</button>
					</div>
				</div>
				<div className="relative z-10 flex flex-col gap-5">
					<div className="flex justify-center gap-4">
						<span className="h-2.5 w-2.5 rounded-none bg-[#FAFAFA]" />
						<span className="h-2.5 w-2.5 rounded-none bg-[#1E1E1E]" />
						<span className="h-2.5 w-2.5 rounded-none bg-[#1E1E1E]" />
					</div>
					<button
						type="button"
						className="flex w-full items-center justify-center gap-2.5 border border-[#1E1E1E] bg-[#0A0A0A] py-3.5 font-mono text-sm leading-[18px] text-white transition-colors hover:bg-[#141414]"
						style={{ fontFamily: "var(--font-geist-mono), monospace" }}
					>
						Switch Wallet
						<ChevronDown className="h-4 w-4 rotate-[-90deg]" strokeWidth={1} />
					</button>
				</div>
			</div>
		</div>
	);
}

function TotalPortfolioChart() {
	const [selectedTime, setSelectedTime] =
		useState<(typeof timeRanges)[number]>("1W");
	return (
		<div className="min-h-[373px] flex-1 rounded-none border border-[#1E1E1E] p-6">
			<div className="mb-6 flex flex-col gap-5">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#1E1E1E] bg-[#141414]">
							<BarChart3 className="h-4 w-4 text-white" strokeWidth={1.1} />
						</div>
						<div className="flex items-center gap-3">
							<span
								className="text-base leading-7 text-[#FAFAFA]"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								Total Portfolio
							</span>
							<div className="flex items-center gap-1">
								<span
									className="text-xs leading-[18px] text-[#B2B2B2]"
									style={{
										fontFamily:
											"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
									}}
								>
									Avrj...
								</span>
								<button type="button" aria-label="Copy">
									<Copy className="h-4 w-4 text-[#B2B2B2]" strokeWidth={1} />
								</button>
							</div>
						</div>
					</div>
					<div className="flex border border-[#1E1E1E] [&>button]:border-r [&>button]:border-[#1E1E1E] [&>button:last-child]:border-r-0">
						{timeRanges.map((range) => (
							<button
								key={range}
								type="button"
								onClick={() => setSelectedTime(range)}
								className={`min-h-10 px-4 py-2 text-sm leading-5 transition-colors ${
									selectedTime === range
										? "bg-[#0B0B0B] text-[#FAFAFA]"
										: "bg-[#0C0C0C] text-[#8A8A8A] hover:text-[#B2B2B2]"
								}`}
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								{range}
							</button>
						))}
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-6">
					<div className="flex h-10 items-center gap-2.5 rounded-none border border-[#1E1E1E] bg-[#141414] px-3 py-2">
						<div
							className="h-[19px] w-[19px] shrink-0 rounded-none bg-[#D6CFB7]"
							aria-hidden
						/>
						<span
							className="font-mono text-xs leading-4 text-white"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							Bitcoin (BTC)
						</span>
						<ChevronDown
							className="h-4 w-4 shrink-0 text-white"
							strokeWidth={1}
						/>
					</div>
					<div className="flex items-center gap-3">
						<span
							className="text-[23.64px] leading-[43px] tracking-[-0.02em] text-[#FAFAFA]"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							$70,383.09
						</span>
						<div className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-[#34C759]" strokeWidth={1} />
							<span
								className="text-xs leading-5 text-[#34C759]"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								12%
							</span>
							<span
								className="text-[11.82px] leading-5 text-[#B2B2B2]"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								vs last week
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="h-[193px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={chartData}
						margin={{ top: 8, right: 8, left: 8, bottom: 24 }}
					>
						<defs>
							<linearGradient
								id="portfolio-fill-green"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop offset="0%" stopColor="#34C759" stopOpacity={0.15} />
								<stop offset="100%" stopColor="#34C759" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="0"
							stroke="#282828"
							vertical={false}
						/>
						<XAxis
							dataKey="date"
							axisLine={false}
							tickLine={false}
							tick={{
								fill: "#B2B2B2",
								fontSize: 12,
								fontFamily: "var(--font-inter), Inter, sans-serif",
							}}
							dy={8}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{
								fill: "#B2B2B2",
								fontSize: 12,
								fontFamily: "var(--font-inter), Inter, sans-serif",
							}}
							domain={[0, 1000]}
							ticks={[0, 200, 400, 600, 800, 1000]}
							width={40}
						/>
						<Area
							type="monotone"
							dataKey="value"
							stroke="#34C759"
							strokeWidth={2}
							fill="url(#portfolio-fill-green)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
			<p
				className="-mt-1 text-xs leading-[18px] text-[#B2B2B2]"
				style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
			>
				Profile & Loss
			</p>
		</div>
	);
}

function PortfolioItemCard({
	item,
}: {
	item: (typeof portfolioItems)[number];
}) {
	const risk = riskConfig[item.risk];
	return (
		<div className="flex flex-col gap-[23.64px] rounded-none border border-[#1E1E1E] bg-[#0C0C0C] p-6 shadow-[0px_0.98px_1.97px_rgba(16,24,40,0.05)]">
			<div className="flex flex-col gap-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-4">
						<div
							className="h-[26px] w-[26px] shrink-0 rounded-none border border-white/10"
							style={{ backgroundColor: item.iconColor }}
							aria-hidden
						/>
						<div className="flex flex-col gap-0.5">
							<span
								className="text-sm leading-5 text-[#FAFAFA]"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								{item.name}
							</span>
							<span
								className="text-xs leading-[18px] text-[#B2B2B2]"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								{item.ticker}
							</span>
						</div>
					</div>
					<div className="flex flex-col items-end gap-1">
						<span
							className="font-mono text-xs leading-4 tracking-[-0.02em] text-[#FAFAFA]"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							{item.value}
						</span>
						<div className="flex items-center gap-1">
							<span
								className={`font-mono text-xs leading-5 ${
									item.trend === "up" ? "text-[#34C759]" : "text-[#FF383C]"
								}`}
								style={{ fontFamily: "var(--font-geist-mono), monospace" }}
							>
								{item.trend === "up" ? "+" : ""}
								{item.change}%
							</span>
							{item.trend === "up" ? (
								<TrendingUp
									className="h-5 w-5 text-[#34C759]"
									strokeWidth={1}
								/>
							) : (
								<TrendingDown
									className="h-5 w-5 text-[#FF383C]"
									strokeWidth={1}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="flex items-end justify-between gap-2">
					<span
						className="font-mono text-lg leading-[23px] tracking-[-0.02em] text-[#FAFAFA]"
						style={{ fontFamily: "var(--font-geist-mono), monospace" }}
					>
						{item.holdings}
					</span>
					<div className="flex items-center gap-1.5 rounded-none border border-[#1E1E1E] bg-[#0B0B0B] px-1.5 py-0.5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
						<span
							className="h-2 w-2 rounded-none"
							style={{ backgroundColor: risk.dotColor }}
							aria-hidden
						/>
						<span
							className="text-xs leading-[18px] text-[#FAFAFA]"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							{risk.label}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function PortfolioPage() {
	const [activeTab, setActiveTab] = useState<"all" | "explore" | "watchlist">(
		"all",
	);
	const [activeTimeFilter, setActiveTimeFilter] =
		useState<(typeof assetTimeFilters)[number]>("1W");
	const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
	const [aiInputValue, setAiInputValue] = useState("");

	return (
		<>
			<Header />
			{/* Page title row */}
			<section className="flex flex-row flex-wrap items-start justify-between gap-4 px-6">
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<span
							className="font-serif text-base leading-[21px] text-[#494949]"
							style={{
								fontFamily:
									"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
							}}
						>
							Your
						</span>
						<span
							className="font-serif text-base leading-[21px] text-white"
							style={{
								fontFamily:
									"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
							}}
						>
							Portfolio
						</span>
					</div>
					<p
						className="text-xs font-light leading-4 text-[#494949]"
						style={{ fontFamily: "var(--font-geist-sans), Geist, sans-serif" }}
					>
						Here is a quick snap of your finances
					</p>
				</div>
				<div className="flex items-center gap-2.5">
					<button
						type="button"
						className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#1E1E1E] bg-[#0B0B0B] text-white transition-colors hover:bg-[#141414]"
						aria-label="Grid"
					>
						<LayoutGrid className="h-3.5 w-3.5" strokeWidth={1} />
					</button>
					<div className="flex border border-[#1E1E1E] [&>button]:border-r [&>button]:border-[#1E1E1E] [&>button:last-child]:border-r-0">
						<button
							type="button"
							className="h-11 border-r border-[#1E1E1E] bg-[#0A0A0A] px-6 py-3.5 font-mono text-sm leading-[18px] text-white transition-colors"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							Overview
						</button>
						<button
							type="button"
							className="h-11 bg-[#0B0B0B] px-6 py-3.5 font-mono text-sm leading-[18px] text-[#8A8A8A] transition-colors hover:text-[#B2B2B2]"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							Activity
						</button>
					</div>
				</div>
			</section>

			{/* Wallet + Total Portfolio */}
			<section className="flex flex-row gap-6 px-6">
				<WalletCard />
				<TotalPortfolioChart />
			</section>

			{/* Asset tabs */}
			<section className="flex flex-1 flex-col gap-6 px-6">
				<div className="flex flex-row flex-wrap items-center justify-between gap-4">
					<div className="flex border border-[#1E1E1E] [&>button]:border-r [&>button]:border-[#1E1E1E] [&>button:last-child]:border-r-0">
						{(
							[
								{ id: "all" as const, label: "All Assets" },
								{ id: "explore" as const, label: "Explore Tokens" },
								{ id: "watchlist" as const, label: "Watchlist" },
							] as const
						).map(({ id, label }) => (
							<button
								key={id}
								type="button"
								onClick={() => setActiveTab(id)}
								className={`h-11 px-6 py-3.5 text-sm leading-5 transition-colors ${
									activeTab === id
										? "bg-[#0A0A0A] text-white"
										: "bg-[#0B0B0B] text-[#8A8A8A] hover:text-[#B2B2B2]"
								}`}
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				{/* Search + filters */}
				<div className="flex flex-row flex-wrap items-center justify-between gap-4">
					<div className="flex flex-1 items-center gap-3 min-w-0">
						<Search
							className="h-[18px] w-[18px] shrink-0 text-[#494949]"
							strokeWidth={1.5}
						/>
						<input
							type="text"
							placeholder="Search transactions..."
							className="min-w-0 flex-1 border-0 bg-transparent text-[15.68px] leading-[21px] text-[#FAFAFA] placeholder:text-[#494949] focus:outline-none focus:ring-0"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
							aria-label="Search transactions"
						/>
					</div>
					<div className="flex items-center gap-6">
						<div className="flex border border-[#1E1E1E] [&>button]:border-r [&>button]:border-[#1E1E1E] [&>button:last-child]:border-r-0">
							{assetTimeFilters.map((t) => (
								<button
									key={t}
									type="button"
									onClick={() => setActiveTimeFilter(t)}
									className={`min-h-10 px-4 py-2 text-sm leading-5 transition-colors ${
										activeTimeFilter === t
											? "bg-[#0B0B0B] text-[#FAFAFA]"
											: "bg-[#0C0C0C] text-[#8A8A8A] hover:text-[#B2B2B2]"
									}`}
									style={{
										fontFamily:
											"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
									}}
								>
									{t}
								</button>
							))}
						</div>
						<button
							type="button"
							className="flex h-10 items-center gap-1 border border-[#1E1E1E] bg-[#0B0B0B] px-3.5 py-2.5 text-sm leading-5 text-[#FAFAFA] transition-colors hover:bg-[#141414]"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							<SlidersHorizontal className="h-5 w-5" strokeWidth={1.5} />
							Status
						</button>
						<div className="flex border border-[#1E1E1E] [&>button]:border-r [&>button]:border-[#1E1E1E] [&>button:last-child]:border-r-0">
							<button
								type="button"
								onClick={() => setViewMode("grid")}
								className={`flex h-10 w-11 items-center justify-center transition-colors ${
									viewMode === "grid"
										? "bg-[#0B0B0B] text-[#FAFAFA]"
										: "bg-[#0C0C0C] text-[#8A8A8A]"
								}`}
								aria-label="Grid view"
							>
								<Table2 className="h-3.5 w-3.5" strokeWidth={1} />
							</button>
							<button
								type="button"
								onClick={() => setViewMode("table")}
								className={`flex h-10 w-11 items-center justify-center transition-colors ${
									viewMode === "table"
										? "bg-[#0B0B0B] text-[#FAFAFA]"
										: "bg-[#0C0C0C] text-[#8A8A8A]"
								}`}
								aria-label="Table view"
							>
								<LayoutGrid className="h-3.5 w-3.5" strokeWidth={1} />
							</button>
						</div>
					</div>
				</div>

				{/* Portfolio items grid */}
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
					{portfolioItems.map((item, i) => (
						<PortfolioItemCard key={`${item.ticker}-${i}`} item={item} />
					))}
				</div>
			</section>

			{/* Floating chat input */}
			<div className="sticky bottom-0 left-0 right-0 z-10 flex justify-center px-6 pb-6 pt-4">
				<div
					className="w-full max-w-[574px] rounded-none px-6 py-4 backdrop-blur-[3px]"
					style={{ background: "rgba(255, 255, 255, 0.02)" }}
				>
					<AIInputBox value={aiInputValue} onChange={setAiInputValue} />
				</div>
			</div>
		</>
	);
}
