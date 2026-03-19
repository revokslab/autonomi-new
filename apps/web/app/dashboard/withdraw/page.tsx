"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
	useSignAndSendTransaction,
	useWallets,
} from "@privy-io/react-auth/solana";
import {
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { ExternalLink, Send } from "lucide-react";

import { Header } from "@/components/dashboard/Header";
import {
	createSolanaConnection,
	formatSol,
	getEmbeddedSolanaAddressFromLinkedAccounts,
	lamportsToSol,
	shortenAddress,
	solanaExplorerTxUrl,
	type PrivyLinkedAccount,
} from "@/lib/solana";

function parseAmountToLamports(amount: string): number | null {
	const n = Number(amount);
	if (!Number.isFinite(n) || n <= 0) return null;
	const lamports = Math.floor(n * LAMPORTS_PER_SOL);
	if (lamports <= 0) return null;
	return lamports;
}

export default function WithdrawPage() {
	const { user } = usePrivy();
	const fromAddress = useMemo(
		() =>
			getEmbeddedSolanaAddressFromLinkedAccounts(
				(user?.linkedAccounts as unknown as PrivyLinkedAccount[]) ?? [],
			),
		[user?.linkedAccounts],
	);

	const { wallets } = useWallets();
	const { signAndSendTransaction } = useSignAndSendTransaction();

	const [connection] = useState<Connection>(() => createSolanaConnection());
	const [balanceLamports, setBalanceLamports] = useState<number | null>(null);
	const [balanceLoading, setBalanceLoading] = useState(false);

	const [toAddress, setToAddress] = useState("");
	const [amount, setAmount] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [signature, setSignature] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			if (!fromAddress) {
				setBalanceLamports(null);
				return;
			}
			setBalanceLoading(true);
			try {
				const lamports = await connection.getBalance(
					new PublicKey(fromAddress),
				);
				if (!cancelled) setBalanceLamports(lamports);
			} catch {
				if (!cancelled) setBalanceLamports(null);
			} finally {
				if (!cancelled) setBalanceLoading(false);
			}
		};
		void run();

		return () => {
			cancelled = true;
		};
	}, [connection, fromAddress]);

	const canSend = useMemo(() => {
		const lamports = parseAmountToLamports(amount);
		if (!fromAddress) return false;
		if (!toAddress.trim()) return false;
		if (!lamports) return false;
		if (balanceLamports != null && lamports > balanceLamports) return false;
		if (!wallets || wallets.length === 0) return false;
		return true;
	}, [amount, balanceLamports, fromAddress, toAddress, wallets]);

	const handleSend = async () => {
		setError(null);
		setSignature(null);
		if (!fromAddress) {
			setError("No embedded Solana wallet found.");
			return;
		}
		const lamports = parseAmountToLamports(amount);
		if (!lamports) {
			setError("Enter a valid amount.");
			return;
		}

		let toPubkey: PublicKey;
		try {
			toPubkey = new PublicKey(toAddress.trim());
		} catch {
			setError("Invalid recipient address.");
			return;
		}

		const wallet = wallets[0];
		setSubmitting(true);
		try {
			const fromPubkey = new PublicKey(fromAddress);
			const { blockhash } = await connection.getLatestBlockhash("finalized");

			const tx = new Transaction();
			tx.feePayer = fromPubkey;
			tx.recentBlockhash = blockhash;
			tx.add(
				SystemProgram.transfer({
					fromPubkey,
					toPubkey,
					lamports,
				}),
			);

			const serialized = tx.serialize({
				requireAllSignatures: false,
				verifySignatures: false,
			});

			const out = await signAndSendTransaction({
				transaction: serialized,
				wallet,
				chain: "solana:mainnet",
			});

			setSignature(bs58.encode(out.signature));

			// Refresh balance after sending
			const newBal = await connection.getBalance(fromPubkey);
			setBalanceLamports(newBal);
		} catch (e) {
			console.error(e);
			setError("Transaction failed or was cancelled.");
		} finally {
			setSubmitting(false);
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
						Withdraw
					</h1>
					<p
						className="mt-1 text-sm text-neutral-500"
						style={{
							fontFamily:
								"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
						}}
					>
						Send SOL from your embedded Solana wallet (mainnet).
					</p>
				</section>

				<section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
					<div className="rounded-sm border border-neutral-200 bg-white p-5">
						<p
							className="text-sm font-medium text-neutral-900"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							From
						</p>
						<p className="mt-2 font-mono text-sm text-neutral-800">
							{fromAddress ? fromAddress : "No embedded Solana wallet found."}
						</p>
						<p className="mt-2 text-xs text-neutral-500">
							Balance:{" "}
							{balanceLoading
								? "Loading…"
								: balanceLamports == null
									? "—"
									: formatSol(lamportsToSol(balanceLamports))}
						</p>

						<div className="mt-5 space-y-4">
							<div>
								<label className="block text-sm font-medium text-neutral-700">
									Recipient
								</label>
								<input
									type="text"
									value={toAddress}
									onChange={(e) => setToAddress(e.target.value)}
									placeholder="Solana address"
									className="mt-1 w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-neutral-700">
									Amount (SOL)
								</label>
								<input
									type="number"
									inputMode="decimal"
									min="0"
									step="0.0001"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder="0.01"
									className="mt-1 w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
								/>
							</div>

							{error && (
								<p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
									{error}
								</p>
							)}

							<button
								type="button"
								onClick={handleSend}
								disabled={!canSend || submitting}
								className="flex w-full items-center justify-center gap-2 rounded-sm border border-neutral-900 bg-neutral-900 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								<Send className="h-4 w-4" strokeWidth={2} />
								{submitting ? "Submitting…" : "Send SOL"}
							</button>
						</div>
					</div>

					<div className="rounded-sm border border-neutral-200 bg-white p-5">
						<p
							className="text-sm font-medium text-neutral-900"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							Transaction
						</p>
						<p className="mt-2 text-sm text-neutral-500">
							You’ll be prompted by Privy to approve this transfer.
						</p>

						{signature ? (
							<div className="mt-4 rounded-sm border border-neutral-200 bg-neutral-50 p-4">
								<p className="text-xs text-neutral-500">Signature</p>
								<p className="mt-1 break-all font-mono text-xs text-neutral-800">
									{signature}
								</p>
								<a
									href={solanaExplorerTxUrl(signature)}
									target="_blank"
									rel="noreferrer"
									className="mt-3 inline-flex items-center gap-2 rounded-sm border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-50"
								>
									<ExternalLink className="h-4 w-4" strokeWidth={2} />
									View on explorer
								</a>
							</div>
						) : (
							<div className="mt-4 rounded-sm border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-500">
								No transaction yet.
							</div>
						)}

						{fromAddress && (
							<p className="mt-4 text-xs text-neutral-500">
								From: {shortenAddress(fromAddress)}
							</p>
						)}
					</div>
				</section>
			</div>
		</>
	);
}
