export function lamportsToSol(lamports: number): number {
	return lamports / 1_000_000_000;
}

export function formatSol(
	sol: number,
	opts?: { maxDecimals?: number },
): string {
	const maxDecimals = opts?.maxDecimals ?? 4;
	return `${sol.toLocaleString(undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: maxDecimals,
	})} SOL`;
}

export function shortenAddress(address: string, chars = 4): string {
	if (address.length <= chars * 2 + 3) return address;
	return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}
