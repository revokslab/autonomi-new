"use client";

import { useState, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Header } from "@/components/dashboard/Header";
import {
	Heart,
	Key,
	Fingerprint,
	Wallet,
	Mail,
	ChevronRight,
	Plus,
	Minus,
	X,
	LogOut,
} from "lucide-react";

type LinkedAccount =
	| { type: "email"; address?: string }
	| { type: "google"; subject?: string; name?: string; email?: string }
	| { type: "twitter"; subject?: string; username?: string }
	| {
			type: "wallet";
			address?: string;
			chainType?: string;
			walletClientType?: string;
	  }
	| { type: string };

interface FavoriteAddress {
	id: string;
	label: string;
	address: string;
}

function generateId() {
	return `addr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function SettingsPage() {
	const {
		user,
		logout,
		exportWallet,
		linkWallet,
		linkEmail,
		linkGoogle,
		linkTwitter,
		unlinkWallet,
		unlinkEmail,
		unlinkGoogle,
		unlinkTwitter,
		ready,
		authenticated,
	} = usePrivy();

	const [favoriteAddresses, setFavoriteAddresses] = useState<FavoriteAddress[]>(
		[],
	);
	const [addressModalOpen, setAddressModalOpen] = useState(false);
	const [newAddressLabel, setNewAddressLabel] = useState("");
	const [newAddressValue, setNewAddressValue] = useState("");

	const linkedAccounts = (user?.linkedAccounts ?? []) as LinkedAccount[];
	const emailAccount = linkedAccounts.find((a) => a.type === "email") as
		| { address?: string }
		| undefined;
	const googleAccount = linkedAccounts.find((a) => a.type === "google") as
		| { subject?: string; email?: string; name?: string }
		| undefined;
	const twitterAccount = linkedAccounts.find((a) => a.type === "twitter") as
		| { subject?: string; username?: string }
		| undefined;
	const walletAccounts = linkedAccounts.filter((a) => a.type === "wallet") as {
		address?: string;
		chainType?: string;
		walletClientType?: string;
	}[];

	const isEmbedded = (w: (typeof walletAccounts)[0]) =>
		w.walletClientType === "privy" || w.walletClientType === "privy-v2";

	const embeddedWallets = walletAccounts.filter(isEmbedded);
	const embeddedEthereum = embeddedWallets.find(
		(w) => w.chainType === "ethereum",
	);
	const embeddedSolana = embeddedWallets.find((w) => w.chainType === "solana");

	const [exporting, setExporting] = useState<"ethereum" | "solana" | null>(
		null,
	);

	const handleExportEthereum = useCallback(async () => {
		if (!embeddedEthereum?.address) return;
		setExporting("ethereum");
		try {
			await exportWallet({ address: embeddedEthereum.address });
		} catch (e) {
			console.error("Export Ethereum key failed:", e);
		} finally {
			setExporting(null);
		}
	}, [exportWallet, embeddedEthereum?.address]);

	const handleExportSolana = useCallback(async () => {
		if (!embeddedSolana?.address) return;
		setExporting("solana");
		try {
			await exportWallet({ address: embeddedSolana.address });
		} catch (e) {
			console.error("Export Solana key failed:", e);
		} finally {
			setExporting(null);
		}
	}, [exportWallet, embeddedSolana?.address]);

	const handleAddAddress = useCallback(() => {
		const label = newAddressLabel.trim();
		const address = newAddressValue.trim();
		if (!address) return;
		setFavoriteAddresses((prev) => [
			...prev,
			{ id: generateId(), label: label || "Unnamed", address },
		]);
		setNewAddressLabel("");
		setNewAddressValue("");
		setAddressModalOpen(false);
	}, [newAddressLabel, newAddressValue]);

	const removeAddress = useCallback((id: string) => {
		setFavoriteAddresses((prev) => prev.filter((a) => a.id !== id));
	}, []);

	const fontSans = {
		fontFamily: "var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
	};
	const fontSerif = {
		fontFamily: "var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
	};

	return (
		<>
			<Header />
			<div className="flex flex-1 flex-col gap-8 px-6 pt-8">
				<section>
					<h1 className="text-2xl text-neutral-900" style={fontSerif}>
						Settings
					</h1>
					<p className="mt-1 text-sm text-neutral-500" style={fontSans}>
						Manage addresses, security, and login methods.
					</p>
				</section>

				{/* Favorite Addresses */}
				<section>
					<button
						type="button"
						onClick={() => setAddressModalOpen(true)}
						className="flex w-full items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 text-left transition-colors hover:bg-neutral-50"
					>
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
							<Heart className="h-6 w-6" fill="currentColor" stroke="none" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="font-medium text-neutral-900" style={fontSans}>
								Favorite Addresses
							</p>
							<p className="text-sm text-neutral-500">
								{favoriteAddresses.length === 0
									? "Add addresses you use often"
									: `${favoriteAddresses.length} saved`}
							</p>
						</div>
						<ChevronRight className="h-5 w-5 shrink-0 text-neutral-400" />
					</button>
					{favoriteAddresses.length > 0 && (
						<ul className="mt-3 space-y-2">
							{favoriteAddresses.map((addr) => (
								<li
									key={addr.id}
									className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3"
								>
									<div className="min-w-0">
										<p
											className="font-medium text-neutral-900"
											style={fontSans}
										>
											{addr.label}
										</p>
										<p className="truncate font-mono text-xs text-neutral-500">
											{addr.address}
										</p>
									</div>
									<button
										type="button"
										onClick={() => removeAddress(addr.id)}
										className="shrink-0 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
										aria-label="Remove address"
									>
										<X className="h-4 w-4" strokeWidth={2} />
									</button>
								</li>
							))}
						</ul>
					)}
				</section>

				{/* Security */}
				<section>
					<h2
						className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500"
						style={fontSans}
					>
						Security
					</h2>
					<div className="space-y-2 rounded-xl border border-neutral-200 bg-white">
						{embeddedWallets.length === 0 ? (
							<div className="flex items-center gap-4 px-4 py-3 text-neutral-500">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
									<Key className="h-5 w-5" strokeWidth={1.5} />
								</div>
								<p className="text-sm">
									No embedded wallet to export. Link or create a wallet in Login
									to get an exportable key.
								</p>
							</div>
						) : (
							<>
								{embeddedSolana?.address && (
									<>
										<button
											type="button"
											onClick={handleExportSolana}
											disabled={!!exporting}
											className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-neutral-50 disabled:opacity-60"
										>
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
												<Key className="h-5 w-5" strokeWidth={1.5} />
											</div>
											<span
												className="flex-1 font-medium text-neutral-900"
												style={fontSans}
											>
												Export Solana private key
											</span>
											{exporting === "solana" ? (
												<span className="text-xs text-neutral-500">
													Opening Privy…
												</span>
											) : (
												<ChevronRight className="h-5 w-5 text-neutral-400" />
											)}
										</button>
										<div className="border-t border-neutral-100" />
									</>
								)}
								{embeddedEthereum?.address && (
									<>
										<button
											type="button"
											onClick={handleExportEthereum}
											disabled={!!exporting}
											className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-neutral-50 disabled:opacity-60"
										>
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
												<Key className="h-5 w-5" strokeWidth={1.5} />
											</div>
											<span
												className="flex-1 font-medium text-neutral-900"
												style={fontSans}
											>
												Export Ethereum private key
											</span>
											{exporting === "ethereum" ? (
												<span className="text-xs text-neutral-500">
													Opening Privy…
												</span>
											) : (
												<ChevronRight className="h-5 w-5 text-neutral-400" />
											)}
										</button>
										<div className="border-t border-neutral-100" />
									</>
								)}
							</>
						)}
						<div className="flex w-full items-center gap-4 px-4 py-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
								<Fingerprint className="h-5 w-5" strokeWidth={1.5} />
							</div>
							<span
								className="flex-1 font-medium text-neutral-900"
								style={fontSans}
							>
								Passkeys
							</span>
							<span className="text-sm text-neutral-500">0</span>
							<ChevronRight className="h-5 w-5 text-neutral-400" />
						</div>
					</div>
				</section>

				{/* Login */}
				<section>
					<h2
						className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500"
						style={fontSans}
					>
						Login
					</h2>
					<div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-1">
						<div className="flex items-center justify-between gap-4 px-3 py-3">
							<div className="flex items-center gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
									<Wallet className="h-5 w-5" strokeWidth={1.5} />
								</div>
								<span className="font-medium text-neutral-900" style={fontSans}>
									Linked Wallets
								</span>
							</div>
							<button
								type="button"
								onClick={() => linkWallet()}
								className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
								aria-label="Add wallet"
							>
								<Plus className="h-4 w-4" strokeWidth={2} />
							</button>
						</div>
						<div className="border-t border-neutral-100" />
						<div className="flex items-center justify-between gap-4 px-3 py-3">
							<div className="flex items-center gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
									<Mail className="h-5 w-5" strokeWidth={1.5} />
								</div>
								<div>
									<span
										className="font-medium text-neutral-900"
										style={fontSans}
									>
										Email
									</span>
									{emailAccount?.address && (
										<p className="text-xs text-neutral-500">
											{emailAccount.address}
										</p>
									)}
								</div>
							</div>
							{emailAccount ? (
								<button
									type="button"
									onClick={() => unlinkEmail(emailAccount.address!)}
									className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
									aria-label="Remove email"
								>
									<Minus className="h-4 w-4" strokeWidth={2} />
								</button>
							) : (
								<button
									type="button"
									onClick={() => linkEmail()}
									className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
									aria-label="Add email"
								>
									<Plus className="h-4 w-4" strokeWidth={2} />
								</button>
							)}
						</div>
						<div className="border-t border-neutral-100" />
						<LoginRow
							icon={<GoogleIcon />}
							label="Google"
							sub={googleAccount?.email}
							linked={!!googleAccount}
							onAdd={linkGoogle}
							onRemove={
								googleAccount?.subject
									? () => unlinkGoogle(googleAccount.subject!)
									: undefined
							}
						/>
						<div className="border-t border-neutral-100" />
						<LoginRow
							icon={<TwitterIcon />}
							label="Twitter"
							sub={twitterAccount?.username}
							linked={!!twitterAccount}
							onAdd={linkTwitter}
							onRemove={
								twitterAccount?.subject
									? () => unlinkTwitter(twitterAccount.subject!)
									: undefined
							}
						/>
					</div>
				</section>

				{/* Logout */}
				<section className="pt-4">
					<button
						type="button"
						onClick={() => logout()}
						disabled={!ready || !authenticated}
						className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
						style={fontSans}
					>
						<LogOut className="h-4 w-4" strokeWidth={2} />
						Log out
					</button>
				</section>
			</div>

			{/* Add address modal */}
			{addressModalOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
					onClick={() => setAddressModalOpen(false)}
					role="dialog"
					aria-modal="true"
					aria-labelledby="add-address-title"
				>
					<div
						className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<h2
							id="add-address-title"
							className="text-lg font-medium text-neutral-900"
							style={fontSerif}
						>
							Add favorite address
						</h2>
						<div className="mt-4 space-y-3">
							<div>
								<label
									htmlFor="addr-label"
									className="block text-sm font-medium text-neutral-700"
								>
									Label (optional)
								</label>
								<input
									id="addr-label"
									type="text"
									value={newAddressLabel}
									onChange={(e) => setNewAddressLabel(e.target.value)}
									placeholder="e.g. My wallet"
									className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
								/>
							</div>
							<div>
								<label
									htmlFor="addr-value"
									className="block text-sm font-medium text-neutral-700"
								>
									Address
								</label>
								<input
									id="addr-value"
									type="text"
									value={newAddressValue}
									onChange={(e) => setNewAddressValue(e.target.value)}
									placeholder="0x... or base58"
									className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-mono text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
								/>
							</div>
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setAddressModalOpen(false)}
								className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleAddAddress}
								disabled={!newAddressValue.trim()}
								className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
							>
								Add
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

function GoogleIcon() {
	return (
		<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
			<svg
				width="20"
				height="20"
				viewBox="0 0 18 18"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M17.64 9.2C17.64 8.57 17.58 7.95 17.48 7.36H9v2.49h4.84c-.2 1.12-.83 2.07-1.79 2.71v2.26h2.91c1.7-1.57 2.64-3.87 2.64-6.61Z"
					fill="#4285F4"
				/>
				<path
					d="M9 18c2.43 0 4.47-.79 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.04-3.71H.96v2.33C2.44 15.98 5.48 18 9 18Z"
					fill="#34A853"
				/>
				<path
					d="M3.96 10.71c-.18-.54-.28-1.11-.28-1.7 0-.59.1-1.16.28-1.7V4.96H.96C.35 6.17 0 7.55 0 9c0 1.45.35 2.83.96 4.04l3-2.33Z"
					fill="#FBBC05"
				/>
				<path
					d="M9 3.58c1.32 0 2.51.45 3.44 1.33l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.04 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
					fill="#EA4335"
				/>
			</svg>
		</div>
	);
}

function TwitterIcon() {
	return (
		<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="text-neutral-700"
			>
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
			</svg>
		</div>
	);
}

function LoginRow({
	icon,
	label,
	sub,
	linked,
	onAdd,
	onRemove,
}: {
	icon: React.ReactNode;
	label: string;
	sub?: string;
	linked: boolean;
	onAdd: () => void;
	onRemove?: () => void;
}) {
	const fontSans = {
		fontFamily: "var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
	};
	return (
		<div className="flex items-center justify-between gap-4 px-3 py-3">
			<div className="flex items-center gap-4">
				{icon}
				<div>
					<span className="font-medium text-neutral-900" style={fontSans}>
						{label}
					</span>
					{sub && <p className="text-xs text-neutral-500">{sub}</p>}
				</div>
			</div>
			{linked && onRemove ? (
				<button
					type="button"
					onClick={onRemove}
					className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
					aria-label={`Remove ${label}`}
				>
					<Minus className="h-4 w-4" strokeWidth={2} />
				</button>
			) : (
				<button
					type="button"
					onClick={onAdd}
					className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
					aria-label={`Add ${label}`}
				>
					<Plus className="h-4 w-4" strokeWidth={2} />
				</button>
			)}
		</div>
	);
}
