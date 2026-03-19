export type PrivyLinkedAccount =
	| {
			type: "wallet";
			address?: string;
			chainType?: string;
			walletClientType?: string;
	  }
	| { type: string; [key: string]: unknown };

export function getEmbeddedSolanaAddressFromLinkedAccounts(
	linkedAccounts: PrivyLinkedAccount[] | undefined,
): string | null {
	if (!linkedAccounts) return null;
	const wallet = linkedAccounts.find((a) => {
		if (a.type !== "wallet") return false;
		const w = a as Extract<PrivyLinkedAccount, { type: "wallet" }>;
		const isSolana = w.chainType === "solana";
		const isEmbedded =
			w.walletClientType === "privy" || w.walletClientType === "privy-v2";
		return isSolana && isEmbedded && !!w.address;
	}) as Extract<PrivyLinkedAccount, { type: "wallet" }> | undefined;

	return wallet?.address ?? null;
}
