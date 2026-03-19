export type SolanaToken = {
	symbol: string;
	name: string;
	mint: string;
	decimals: number;
};

export const SOLANA_TOKENS: SolanaToken[] = [
	{
		symbol: "SOL",
		name: "Solana",
		mint: "So11111111111111111111111111111111111111112",
		decimals: 9,
	},
	{
		symbol: "USDC",
		name: "USD Coin",
		mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
		decimals: 6,
	},
	{
		symbol: "BONK",
		name: "Bonk",
		mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6A9aQGfY2h2A9jz",
		decimals: 5,
	},
	{
		symbol: "JUP",
		name: "Jupiter",
		mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
		decimals: 6,
	},
];

export function getTokenByMint(mint: string): SolanaToken | undefined {
	return SOLANA_TOKENS.find((t) => t.mint === mint);
}
