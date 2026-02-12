"use client";

import { BarChart3, ChevronDown } from "lucide-react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { useState, useRef, useEffect } from "react";

const portfolioData = [
	{ date: "21 Jul", value: 200 },
	{ date: "22 Jul", value: 350 },
	{ date: "23 Jul", value: 280 },
	{ date: "24 Jul", value: 520 },
	{ date: "25 Jul", value: 600 },
	{ date: "26 Jul", value: 750 },
	{ date: "27 Jul", value: 1000 },
];

const timeRanges = ["24H", "1W", "1M", "1Y"] as const;

const assets = [
	{ symbol: "BTC", name: "Bitcoin", color: "#F7931A" },
	{ symbol: "ETH", name: "Ethereum", color: "#627EEA" },
	{ symbol: "SOL", name: "Solana", color: "#9945FF" },
	{ symbol: "USDC", name: "USD Coin", color: "#2775CA" },
];

export function PortfolioPanel() {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedAsset, setSelectedAsset] = useState(assets[0]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}

		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isDropdownOpen]);
	return (
		<div className="flex flex-1 flex-col gap-6 border border-[#1E1E1E] p-6">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#1E1E1E] bg-[#141414]">
						<BarChart3 className="h-4 w-4 text-white" strokeWidth={1.1} />
					</div>
					<span
						className="text-base leading-7 text-[#FAFAFA]"
						style={{
							fontFamily:
								"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
						}}
					>
						Total Portfolio
					</span>
				</div>
				<div className="flex items-center gap-1 border border-[#1E1E1E] [&>button]:border-r [&>button]:border-[#1E1E1E] [&>button:last-child]:border-r-0">
					{timeRanges.map((range, i) => (
						<button
							key={range}
							type="button"
							className={`min-h-10 px-4 py-2 text-sm leading-5 transition-colors ${
								i === 1
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
				<div className="relative" ref={dropdownRef}>
					<button
						type="button"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className="flex h-10 items-center gap-2.5 border border-[#1E1E1E] bg-[#141414] px-3 py-2 transition-colors hover:bg-[#1a1a1a]"
						aria-label="Select asset"
						aria-expanded={isDropdownOpen}
					>
						<div
							className="h-[19px] w-[19px] shrink-0 rounded-none"
							style={{ backgroundColor: selectedAsset.color }}
							aria-hidden
						/>
						<span
							className="font-mono text-xs leading-4 text-white"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							{selectedAsset.name} ({selectedAsset.symbol})
						</span>
						<ChevronDown
							className={`h-4 w-4 shrink-0 text-white transition-transform ${
								isDropdownOpen ? "rotate-180" : ""
							}`}
							strokeWidth={1}
						/>
					</button>
					{isDropdownOpen && (
						<div className="absolute left-0 top-full z-50 mt-1 min-w-[175px] border border-[#1E1E1E] bg-[#0B0B0B] shadow-lg">
							{assets.map((asset) => (
								<button
									key={asset.symbol}
									type="button"
									onClick={() => {
										setSelectedAsset(asset);
										setIsDropdownOpen(false);
									}}
									className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${
										selectedAsset.symbol === asset.symbol
											? "bg-[#141414]"
											: "hover:bg-[#141414]"
									}`}
								>
									<div
										className="h-[19px] w-[19px] shrink-0 rounded-none"
										style={{ backgroundColor: asset.color }}
										aria-hidden
									/>
									<span
										className="font-mono text-xs leading-4 text-white"
										style={{ fontFamily: "var(--font-geist-mono), monospace" }}
									>
										{asset.name} ({asset.symbol})
									</span>
								</button>
							))}
						</div>
					)}
				</div>
				<div className="flex items-center gap-3">
					<span
						className="text-[23.64px] leading-[43px] tracking-[-0.02em] text-[#FAFAFA]"
						style={{ fontFamily: "var(--font-geist-mono), monospace" }}
					>
						$70,383.09
					</span>
					<div className="flex items-center gap-2">
						<span
							className="text-xs leading-5 text-[#34C759]"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							12%
						</span>
						<span
							className="text-[11.82px] leading-5 text-[#B2B2B2]"
							style={{ fontFamily: "var(--font-geist-sans)" }}
						>
							vs last week
						</span>
					</div>
				</div>
			</div>
			<div className="h-[193px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={portfolioData}
						margin={{ top: 8, right: 8, left: 8, bottom: 24 }}
					>
						<defs>
							<linearGradient id="portfolio-fill" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#34C759" stopOpacity={0.2} />
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
						<Tooltip
							contentStyle={{
								backgroundColor: "#141414",
								border: "1px solid #1E1E1E",
								borderRadius: 0,
								fontFamily: "var(--font-inter), Inter, sans-serif",
								fontSize: 12,
							}}
							labelStyle={{ color: "#B2B2B2" }}
							formatter={(value: number) => [value, "Profile views"]}
						/>
						<Area
							type="monotone"
							dataKey="value"
							stroke="#34C759"
							strokeWidth={2}
							fill="url(#portfolio-fill)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
			<p
				className="-mt-2 text-xs font-medium leading-[18px] text-[#B2B2B2]"
				style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
			>
				Profile views
			</p>
		</div>
	);
}
