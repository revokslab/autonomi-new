"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useFundWallet } from "@privy-io/react-auth/solana";
import QRCode from "qrcode";
import { Copy, ExternalLink, QrCode } from "lucide-react";

import { Header } from "@/components/dashboard/Header";
import {
	getEmbeddedSolanaAddressFromLinkedAccounts,
	type PrivyLinkedAccount,
	shortenAddress,
	solanaExplorerAddressUrl,
} from "@/lib/solana";

export default function DepositPage() {
	const { user } = usePrivy();
	const { fundWallet } = useFundWallet();
	const address = useMemo(
		() =>
			getEmbeddedSolanaAddressFromLinkedAccounts(
				(user?.linkedAccounts as unknown as PrivyLinkedAccount[]) ?? [],
			),
		[user?.linkedAccounts],
	);

	const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [funding, setFunding] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setQrDataUrl(null);
		if (!address) return;

		QRCode.toDataURL(`solana:${address}`, { margin: 1, scale: 6 })
			.then((url) => {
				if (!cancelled) setQrDataUrl(url);
			})
			.catch(() => {
				if (!cancelled) setQrDataUrl(null);
			});

		return () => {
			cancelled = true;
		};
	}, [address]);

	const handleCopy = async () => {
		if (!address) return;
		try {
			await navigator.clipboard.writeText(address);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 900);
		} catch {
			// ignore
		}
	};

	const handleBuySol = async () => {
		if (!address || funding) return;
		setFunding(true);
		try {
			await fundWallet({
				address,
				options: {
					chain: "solana:mainnet",
					asset: "native-currency",
				},
			});
		} catch (e) {
			console.error(e);
		} finally {
			setFunding(false);
		}
	};

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
						Deposit
					</h1>
					<p
						className="mt-1 text-sm text-neutral-500"
						style={{
							fontFamily:
								"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
						}}
					>
						Send SOL to your Solana address. This is mainnet.
					</p>
				</section>

				<section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="rounded-sm border border-neutral-200 bg-white p-5">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p
									className="text-sm font-medium text-neutral-900"
									style={{
										fontFamily:
											"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
									}}
								>
									Your Solana address
								</p>
								{address ? (
									<p className="mt-2 break-all font-mono text-sm text-neutral-800">
										{address}
									</p>
								) : (
									<p className="mt-2 text-sm text-neutral-500">
										No embedded Solana wallet found yet. Finish login to create
										it.
									</p>
								)}
							</div>

							<div className="flex shrink-0 items-center gap-2">
								<button
									type="button"
									onClick={handleBuySol}
									disabled={!address || funding}
									className="flex items-center gap-2 rounded-sm border border-neutral-900 bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
									style={{
										fontFamily:
											"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
									}}
								>
									{funding ? "Opening…" : "Buy SOL"}
								</button>
								<button
									type="button"
									onClick={handleCopy}
									disabled={!address}
									className="flex items-center gap-2 rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
									style={{
										fontFamily:
											"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
									}}
								>
									<Copy className="h-4 w-4" strokeWidth={2} />
									{copied ? "Copied" : "Copy"}
								</button>
								{address && (
									<a
										href={solanaExplorerAddressUrl(address)}
										target="_blank"
										rel="noreferrer"
										className="flex items-center gap-2 rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
										style={{
											fontFamily:
												"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
										}}
									>
										<ExternalLink className="h-4 w-4" strokeWidth={2} />
										Explorer
									</a>
								)}
							</div>
						</div>

						<div className="mt-5 rounded-sm border border-neutral-200 bg-neutral-50 p-4">
							<p className="text-xs text-neutral-600">
								Only send Solana (SOL) assets to this address. Deposits may take
								a few confirmations to appear.
							</p>
						</div>
					</div>

					<div className="rounded-sm border border-neutral-200 bg-white p-5">
						<div className="flex items-center justify-between">
							<p
								className="text-sm font-medium text-neutral-900"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								QR code
							</p>
							<div className="flex h-9 w-9 items-center justify-center rounded-sm bg-neutral-100 text-neutral-600">
								<QrCode className="h-5 w-5" strokeWidth={1.5} />
							</div>
						</div>

						<div className="mt-4 flex items-center justify-center">
							{address ? (
								qrDataUrl ? (
									<img
										src={qrDataUrl}
										alt={`Deposit QR for ${shortenAddress(address)}`}
										className="h-[220px] w-[220px] rounded-sm border border-neutral-200 bg-white p-2"
									/>
								) : (
									<div className="flex h-[220px] w-[220px] items-center justify-center rounded-sm border border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
										Generating…
									</div>
								)
							) : (
								<div className="flex h-[220px] w-[220px] items-center justify-center rounded-sm border border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
									Unavailable
								</div>
							)}
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
