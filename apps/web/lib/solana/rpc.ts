import { Connection } from "@solana/web3.js";

const DEFAULT_MAINNET_RPC = "https://api.mainnet-beta.solana.com";

export function getSolanaRpcUrl(): string {
	return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || DEFAULT_MAINNET_RPC;
}

export function createSolanaConnection(): Connection {
	return new Connection(getSolanaRpcUrl(), "confirmed");
}
