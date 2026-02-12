"use client";

import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { Header } from "@/components/dashboard/Header";
import { FloatingChatInput } from "@/components/dashboard/FloatingChatInput";
import {
	Plus,
	ArrowLeftRight,
	ArrowUpRight,
	Wallet,
	TrendingUp,
	User,
	TrendingDown,
	Building2,
	Sparkles,
	BarChart3,
	ChevronRight,
} from "lucide-react";

const assetCards = [
	{
		label: "Main",
		sub: "1 assets",
		value: "$0.00",
		change: "-$9.09",
		changePct: "-10%",
		icon: Wallet,
	},
	{
		label: "Trading",
		sub: "USDC",
		value: "$0.00",
		change: "-$9.09",
		changePct: "-10%",
		icon: TrendingUp,
	},
];

const insightCategoryIcon = {
	whale: User,
	market: TrendingDown,
	institutional: Building2,
	meme: Sparkles,
} as const;

const tradePairs = [
	{
		pair: "BTC · USDC",
		price: "$65,621.5",
		change: "-1.22",
		changePct: "-1.22%",
		sentiment: "Bullish" as const,
		logoUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
	},
	{
		pair: "ETH · USDC",
		price: "$1,914.9",
		change: "0.47",
		changePct: "0.47%",
		sentiment: "Neutral" as const,
		logoUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
	},
	{
		pair: "SOL · USDC",
		price: "$81.29",
		change: "0.22",
		changePct: "0.22%",
		sentiment: "Bullish" as const,
		logoUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
	},
	{
		pair: "PEPE · USDC",
		price: "$0.000012",
		change: "7.05",
		changePct: "7.05%",
		sentiment: "Bullish" as const,
		logoUrl:
			"https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
	},
	{
		pair: "DOGE · USDC",
		price: "$0.31",
		change: "-0.90",
		changePct: "-0.90%",
		sentiment: "Neutral" as const,
		logoUrl: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
	},
	{
		pair: "XRP · USDC",
		price: "$2.14",
		change: "1.02",
		changePct: "1.02%",
		sentiment: "Bullish" as const,
		logoUrl:
			"https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
	},
	{
		pair: "AVAX · USDC",
		price: "$24.88",
		change: "-0.11",
		changePct: "-0.11%",
		sentiment: "Neutral" as const,
		logoUrl:
			"https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
	},
	{
		pair: "LINK · USDC",
		price: "$13.42",
		change: "2.18",
		changePct: "2.18%",
		sentiment: "Bullish" as const,
		logoUrl:
			"https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
	},
	{
		pair: "DOT · USDC",
		price: "$5.62",
		change: "-0.90",
		changePct: "-0.90%",
		sentiment: "Neutral" as const,
		logoUrl:
			"https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
	},
	{
		pair: "MATIC · USDC",
		price: "$0.38",
		change: "0.22",
		changePct: "0.22%",
		sentiment: "Bullish" as const,
		logoUrl:
			"https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
	},
	{
		pair: "UNI · USDC",
		price: "$8.91",
		change: "1.06",
		changePct: "1.06%",
		sentiment: "Bullish" as const,
		logoUrl: "https://assets.coingecko.com/coins/images/12504/small/uni.jpg",
	},
];

const cryptoInsights = [
	{
		title: "Vitalik Buterin sold ETH",
		category: "whale" as keyof typeof insightCategoryIcon,
		source: { name: "Twitter", url: "https://twitter.com" },
	},
	{
		title: "Bitcoin down 3% in 24h",
		category: "market" as keyof typeof insightCategoryIcon,
		source: { name: "CoinDesk", url: "https://coindesk.com" },
	},
	{
		title: "BlackRock bought more BTC",
		category: "institutional" as keyof typeof insightCategoryIcon,
		source: { name: "Bloomberg", url: "https://bloomberg.com" },
	},
	{
		title: "PEPE trending as top meme coin",
		category: "meme" as keyof typeof insightCategoryIcon,
		source: { name: "CoinGecko", url: "https://coingecko.com" },
	},
];

export default function DashboardPage() {
	const { user } = usePrivy();
	const email = user?.linkedAccounts?.find((a) => a.type === "email") as
		| { address?: string }
		| undefined;
	const name = email?.address?.split("@")[0] ?? "there";

	return (
		<>
			<Header />
			<div className="flex flex-1 flex-col gap-8 px-6 pt-8">
				{/* Welcome */}
				<section>
					<h1
						className="text-2xl text-neutral-900"
						style={{
							fontFamily:
								"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
						}}
					>
						Welcome back{name !== "there" ? `, ${name}` : ""}
					</h1>
					<p
						className="mt-1 text-sm text-neutral-500"
						style={{
							fontFamily:
								"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
						}}
					>
						Here&apos;s a quick snapshot of your finances
					</p>
				</section>

				{/* TOTAL + Main + Trading on one row */}
				<section className="flex flex-row gap-4">
					{/* TOTAL */}
					<div className="min-w-[280px] flex-1 rounded-sm border border-neutral-200 bg-gradient-to-b from-emerald-950/90 to-neutral-900 p-6 text-white">
						<p
							className="text-sm text-white/80"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							TOTAL
						</p>
						<p
							className="mt-1 text-3xl tracking-tight"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							$0.00
						</p>
						<div className="mt-4 flex gap-3">
							<button
								type="button"
								className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/20"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								<Plus className="h-4 w-4" strokeWidth={2} />
								Deposit
							</button>
							<button
								type="button"
								className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/20"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								<ArrowLeftRight className="h-4 w-4" strokeWidth={2} />
								Swap
							</button>
							<button
								type="button"
								className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/20"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								<ArrowUpRight className="h-4 w-4" strokeWidth={2} />
								Send
							</button>
						</div>
					</div>
					{/* Main + Trading horizontal */}
					<div className="flex min-w-[200px] flex-1 flex-row gap-4">
						{assetCards.map((card) => {
							const Icon = card.icon;
							const isNegative = card.changePct.startsWith("-");
							return (
								<div
									key={card.label}
									className="flex flex-1 flex-col rounded-sm border border-neutral-200 bg-white p-4"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-neutral-100 text-neutral-600">
											<Icon className="h-5 w-5" strokeWidth={1.5} />
										</div>
										<div className="min-w-0 flex-1">
											<p
												className="text-sm font-medium text-neutral-900"
												style={{
													fontFamily:
														"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
												}}
											>
												{card.label}
											</p>
											<p className="text-xs text-neutral-500">{card.sub}</p>
										</div>
									</div>
									<div className="mt-auto flex flex-col gap-0.5 pt-2">
										<p
											className="text-lg text-neutral-900"
											style={{
												fontFamily: "var(--font-geist-mono), monospace",
											}}
										>
											{card.value}
										</p>
										<p
											className={`text-sm ${isNegative ? "text-red-600" : "text-emerald-600"}`}
											style={{
												fontFamily: "var(--font-geist-mono), monospace",
											}}
										>
											{card.change} {card.changePct}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</section>

				{/* Trade */}
				<section className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-sm bg-neutral-100 text-neutral-600">
								<BarChart3 className="h-4 w-4" strokeWidth={1.5} />
							</div>
							<h2
								className="text-lg font-medium text-neutral-900"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								Trade
							</h2>
						</div>
						<button
							type="button"
							className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
							aria-label="View all"
						>
							<ChevronRight className="h-5 w-5" strokeWidth={2} />
						</button>
					</div>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{tradePairs.map((item) => {
							const isNegative = item.changePct.startsWith("-");
							return (
								<button
									key={item.pair}
									type="button"
									className="flex items-start gap-3 rounded-sm border border-neutral-200 bg-white p-3 text-left transition-colors hover:bg-neutral-50"
								>
									<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
										<Image
											src={item.logoUrl}
											alt=""
											width={40}
											height={40}
											className="object-cover"
										/>
									</div>
									<div className="min-w-0 flex-1">
										<p
											className="text-sm font-medium text-neutral-900"
											style={{
												fontFamily:
													"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
											}}
										>
											{item.pair}
										</p>
										<p
											className="text-xs text-neutral-500"
											style={{
												fontFamily: "var(--font-geist-mono), monospace",
											}}
										>
											{item.price}
										</p>
									</div>
									<div className="flex shrink-0 flex-col items-end gap-0.5">
										<span
											className={`text-xs font-medium ${isNegative ? "text-red-600" : "text-emerald-600"}`}
											style={{
												fontFamily: "var(--font-geist-mono), monospace",
											}}
										>
											{isNegative ? "" : "+"}
											{item.changePct}
										</span>
										<span className="text-xs text-neutral-500">
											{item.sentiment}
										</span>
									</div>
								</button>
							);
						})}
						<button
							type="button"
							className="flex items-center justify-center gap-2 rounded-sm border border-dashed border-neutral-300 bg-neutral-50 py-4 text-sm text-neutral-500 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							Show 12 more
						</button>
					</div>
				</section>

				{/* Crypto insights */}
				<section className="flex flex-col gap-2">
					<h2
						className="text-lg font-medium text-neutral-900"
						style={{
							fontFamily:
								"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
						}}
					>
						Crypto insights
					</h2>
					<div className="flex flex-col gap-2">
						{cryptoInsights.map((insight) => {
							const Icon = insightCategoryIcon[insight.category];
							return (
								<div
									key={insight.title}
									className="flex items-center gap-3 py-1"
								>
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-neutral-100 text-neutral-600">
										<Icon className="h-4 w-4" strokeWidth={1.5} />
									</div>
									<div className="min-w-0 flex-1">
										<span
											className="text-sm text-neutral-900"
											style={{
												fontFamily:
													"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
											}}
										>
											{insight.title}
										</span>
										{" · "}
										<a
											href={insight.source.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-xs text-neutral-500 underline hover:text-neutral-700"
											style={{
												fontFamily:
													"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
											}}
										>
											{insight.source.name}
										</a>
									</div>
								</div>
							);
						})}
					</div>
				</section>

				{/* Spacer so floating input doesn't cover content */}
				<div className="h-24 shrink-0" />
			</div>

			<FloatingChatInput />
		</>
	);
}
