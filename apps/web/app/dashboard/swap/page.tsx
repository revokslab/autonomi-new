"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
	useSignAndSendTransaction,
	useWallets,
} from "@privy-io/react-auth/solana";
import { createJupiterApiClient } from "@jup-ag/api";
import bs58 from "bs58";
import { ArrowLeftRight, ExternalLink, RefreshCcw } from "lucide-react";

import { Header } from "@/components/dashboard/Header";
import {
	computeUnrealizedPnlUsd,
	derivePositions,
	getEmbeddedSolanaAddressFromLinkedAccounts,
	getTokenByMint,
	loadExecutedSwaps,
	saveExecutedSwaps,
	SOLANA_TOKENS,
	type ExecutedSwap,
	type PrivyLinkedAccount,
	solanaExplorerTxUrl,
} from "@/lib/solana";

const jupiter = createJupiterApiClient();

function formatUsd(v: number): string {
	return v.toLocaleString(undefined, {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2,
	});
}

export default function SwapPage() {
	const { user } = usePrivy();
	const { wallets } = useWallets();
	const { signAndSendTransaction } = useSignAndSendTransaction();

	const ownerAddress = useMemo(
		() =>
			getEmbeddedSolanaAddressFromLinkedAccounts(
				(user?.linkedAccounts as unknown as PrivyLinkedAccount[]) ?? [],
			),
		[user?.linkedAccounts],
	);

	const [inputMint, setInputMint] = useState(SOLANA_TOKENS[0].mint); // SOL
	const [outputMint, setOutputMint] = useState(SOLANA_TOKENS[1].mint); // USDC
	const [inputAmountUi, setInputAmountUi] = useState("0.1");
	const [slippageBps, setSlippageBps] = useState(50);

	const [quote, setQuote] = useState<any>(null);
	const [quoteLoading, setQuoteLoading] = useState(false);
	const [swapLoading, setSwapLoading] = useState(false);
	const [swapError, setSwapError] = useState<string | null>(null);
	const [lastSig, setLastSig] = useState<string | null>(null);

	const [swaps, setSwaps] = useState<ExecutedSwap[]>([]);
	const [pricesUsd, setPricesUsd] = useState<Record<string, number>>({});

	useEffect(() => {
		setSwaps(loadExecutedSwaps());
	}, []);

	useEffect(() => {
		saveExecutedSwaps(swaps);
	}, [swaps]);

	const fetchQuote = async () => {
		setSwapError(null);
		const inputToken = getTokenByMint(inputMint);
		if (!inputToken) return;
		const inputAmountNum = Number(inputAmountUi);
		if (!Number.isFinite(inputAmountNum) || inputAmountNum <= 0) {
			setQuote(null);
			return;
		}
		const amountAtomic = Math.floor(inputAmountNum * 10 ** inputToken.decimals);
		if (!Number.isFinite(amountAtomic) || amountAtomic <= 0) {
			setQuote(null);
			return;
		}
		setQuoteLoading(true);
		try {
			const q = await jupiter.quoteGet({
				inputMint,
				outputMint,
				amount: amountAtomic,
				slippageBps,
			});
			setQuote(q);
		} catch (e) {
			console.error(e);
			setQuote(null);
			setSwapError("Failed to fetch quote.");
		} finally {
			setQuoteLoading(false);
		}
	};

	useEffect(() => {
		void fetchQuote();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputMint, outputMint, inputAmountUi, slippageBps]);

	// Poll prices every 8s for PnL display
	useEffect(() => {
		let cancelled = false;
		const mints = SOLANA_TOKENS.map((t) => t.mint).join(",");
		const run = async () => {
			try {
				const res = await fetch(`https://price.jup.ag/v6/price?ids=${mints}`);
				const json = await res.json();
				if (cancelled) return;
				const out: Record<string, number> = {};
				for (const t of SOLANA_TOKENS) {
					const p = json?.data?.[t.mint]?.price;
					if (typeof p === "number") out[t.mint] = p;
				}
				setPricesUsd(out);
			} catch {
				// ignore
			}
		};
		void run();
		const timer = window.setInterval(run, 8000);
		return () => {
			cancelled = true;
			window.clearInterval(timer);
		};
	}, []);

	const handleFlip = () => {
		setInputMint(outputMint);
		setOutputMint(inputMint);
	};

	const canSwap =
		!!ownerAddress && !!quote && wallets.length > 0 && !swapLoading;

	const handleSwap = async () => {
		setSwapError(null);
		setLastSig(null);
		if (!ownerAddress) {
			setSwapError("No embedded Solana wallet found.");
			return;
		}
		if (!quote) {
			setSwapError("No valid quote.");
			return;
		}
		const wallet = wallets[0];
		setSwapLoading(true);
		try {
			const swapResp = await jupiter.swapPost({
				swapRequest: {
					userPublicKey: ownerAddress,
					quoteResponse: quote,
					dynamicComputeUnitLimit: true,
					wrapAndUnwrapSol: true,
				},
			});

			const txBytes = Uint8Array.from(atob(swapResp.swapTransaction), (c) =>
				c.charCodeAt(0),
			);

			const signed = await signAndSendTransaction({
				transaction: txBytes,
				wallet,
				chain: "solana:mainnet",
			});

			const signature = bs58.encode(signed.signature);
			setLastSig(signature);

			const executed: ExecutedSwap = {
				id: `swap-${Date.now()}`,
				ts: Date.now(),
				signature,
				inMint: quote.inputMint,
				outMint: quote.outputMint,
				inAmountAtomic: quote.inAmount,
				outAmountAtomic: quote.outAmount,
			};
			setSwaps((prev) => [executed, ...prev].slice(0, 200));
			void fetchQuote();
		} catch (e) {
			console.error(e);
			setSwapError("Swap failed or was cancelled.");
		} finally {
			setSwapLoading(false);
		}
	};

	const inputToken = getTokenByMint(inputMint);
	const outputToken = getTokenByMint(outputMint);
	const outUi =
		quote && outputToken
			? Number(quote.outAmount) / 10 ** outputToken.decimals
			: 0;

	const positions = useMemo(
		() => derivePositions(swaps, pricesUsd),
		[swaps, pricesUsd],
	);
	const unrealizedPnlUsd = useMemo(
		() => computeUnrealizedPnlUsd(positions, pricesUsd),
		[positions, pricesUsd],
	);

	return (
		<>
			<Header />
			<div className="flex flex-1 flex-col gap-8 px-6 pt-8">
				<section>
					<h1
						className="text-2xl text-neutral-900"
						style={{
							fontFamily:
								"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
						}}
					>
						Swap
					</h1>
					<p className="mt-1 text-sm text-neutral-500">
						Jupiter-powered token swaps on Solana mainnet, with live quote +
						PnL.
					</p>
				</section>

				<section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="rounded-sm border border-neutral-200 bg-white p-5">
						<div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
							<div>
								<label className="block text-sm font-medium text-neutral-700">
									From
								</label>
								<select
									value={inputMint}
									onChange={(e) => setInputMint(e.target.value)}
									className="mt-1 w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm"
								>
									{SOLANA_TOKENS.map((t) => (
										<option key={t.mint} value={t.mint}>
											{t.symbol}
										</option>
									))}
								</select>
								<input
									type="number"
									step="0.000001"
									min="0"
									value={inputAmountUi}
									onChange={(e) => setInputAmountUi(e.target.value)}
									className="mt-2 w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm"
								/>
							</div>
							<button
								type="button"
								onClick={handleFlip}
								className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
								aria-label="Flip tokens"
							>
								<ArrowLeftRight className="h-4 w-4" />
							</button>
							<div>
								<label className="block text-sm font-medium text-neutral-700">
									To
								</label>
								<select
									value={outputMint}
									onChange={(e) => setOutputMint(e.target.value)}
									className="mt-1 w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm"
								>
									{SOLANA_TOKENS.map((t) => (
										<option key={t.mint} value={t.mint}>
											{t.symbol}
										</option>
									))}
								</select>
								<div className="mt-2 w-full rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
									{quoteLoading
										? "Loading quote..."
										: outUi.toLocaleString(undefined, {
												maximumFractionDigits: 6,
											})}
								</div>
							</div>
						</div>

						<div className="mt-4 flex items-center gap-3">
							<label className="text-sm text-neutral-600">Slippage (bps)</label>
							<input
								type="number"
								min="1"
								max="500"
								value={slippageBps}
								onChange={(e) => setSlippageBps(Number(e.target.value || 50))}
								className="w-24 rounded-sm border border-neutral-300 bg-white px-2 py-1 text-sm"
							/>
							<button
								type="button"
								onClick={() => void fetchQuote()}
								className="ml-auto flex items-center gap-2 rounded-sm border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
							>
								<RefreshCcw className="h-4 w-4" />
								Refresh quote
							</button>
						</div>

						{quote && (
							<div className="mt-4 rounded-sm border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
								<div>Route out: {outputToken?.symbol}</div>
								<div>Price impact: {quote.priceImpactPct ?? "0"}%</div>
							</div>
						)}

						{swapError && (
							<div className="mt-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
								{swapError}
							</div>
						)}

						<button
							type="button"
							onClick={handleSwap}
							disabled={!canSwap}
							className="mt-4 w-full rounded-sm border border-neutral-900 bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
						>
							{swapLoading
								? "Swapping..."
								: `Swap ${inputToken?.symbol ?? ""} → ${outputToken?.symbol ?? ""}`}
						</button>

						{lastSig && (
							<a
								href={solanaExplorerTxUrl(lastSig)}
								target="_blank"
								rel="noreferrer"
								className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900"
							>
								<ExternalLink className="h-4 w-4" />
								View tx on explorer
							</a>
						)}
					</div>

					<div className="rounded-sm border border-neutral-200 bg-white p-5">
						<h2 className="text-sm font-medium text-neutral-900">
							Real-time PnL
						</h2>
						<p className="mt-1 text-xs text-neutral-500">
							Based on swaps executed in this app (local history) and live
							prices.
						</p>

						<div className="mt-3 rounded-sm border border-neutral-200 bg-neutral-50 p-3">
							<p className="text-xs text-neutral-500">Unrealized PnL</p>
							<p
								className={`mt-1 text-lg font-medium ${unrealizedPnlUsd >= 0 ? "text-emerald-700" : "text-red-700"}`}
							>
								{formatUsd(unrealizedPnlUsd)}
							</p>
						</div>

						<div className="mt-4 space-y-2">
							{positions.length === 0 ? (
								<p className="text-sm text-neutral-500">No positions yet.</p>
							) : (
								positions.map((p) => {
									const token = getTokenByMint(p.mint);
									const px = pricesUsd[p.mint] ?? 0;
									const pnl = (px - p.avgCostUsd) * p.quantity;
									return (
										<div
											key={p.mint}
											className="rounded-sm border border-neutral-200 bg-white p-3"
										>
											<div className="flex items-center justify-between text-sm">
												<span className="font-medium text-neutral-900">
													{token?.symbol ?? p.mint.slice(0, 4)}
												</span>
												<span
													className={
														pnl >= 0 ? "text-emerald-700" : "text-red-700"
													}
												>
													{formatUsd(pnl)}
												</span>
											</div>
											<div className="mt-1 text-xs text-neutral-500">
												Qty:{" "}
												{p.quantity.toLocaleString(undefined, {
													maximumFractionDigits: 6,
												})}{" "}
												· Avg: {formatUsd(p.avgCostUsd)} · Px: {formatUsd(px)}
											</div>
										</div>
									);
								})
							)}
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
