export type SolanaCluster = "mainnet-beta" | "devnet" | "testnet";

export function getSolanaCluster(): SolanaCluster {
	// App is currently mainnet-only per product decision.
	return "mainnet-beta";
}

export function solanaExplorerAddressUrl(address: string): string {
	return `https://explorer.solana.com/address/${address}?cluster=${getSolanaCluster()}`;
}

export function solanaExplorerTxUrl(signature: string): string {
	return `https://explorer.solana.com/tx/${signature}?cluster=${getSolanaCluster()}`;
}
