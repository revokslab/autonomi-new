import { describe, expect, it } from "vitest";

import {
	formatSol,
	getEmbeddedSolanaAddressFromLinkedAccounts,
	lamportsToSol,
	shortenAddress,
} from "../index";

describe("solana utils", () => {
	it("lamportsToSol converts correctly", () => {
		expect(lamportsToSol(0)).toBe(0);
		expect(lamportsToSol(1_000_000_000)).toBe(1);
		expect(lamportsToSol(2_500_000_000)).toBe(2.5);
	});

	it("formatSol formats with SOL suffix", () => {
		expect(formatSol(0)).toContain("SOL");
		expect(formatSol(1)).toContain("1");
		expect(formatSol(1.23456789, { maxDecimals: 4 })).toContain("1.2346");
	});

	it("shortenAddress shortens long strings", () => {
		expect(shortenAddress("abcd")).toBe("abcd");
		expect(shortenAddress("1234567890", 3)).toBe("123…890");
	});

	it("getEmbeddedSolanaAddressFromLinkedAccounts picks embedded solana", () => {
		const out = getEmbeddedSolanaAddressFromLinkedAccounts([
			{
				type: "wallet",
				chainType: "solana",
				walletClientType: "phantom",
				address: "X",
			},
			{
				type: "wallet",
				chainType: "solana",
				walletClientType: "privy",
				address: "So1anaAddr",
			},
		]);
		expect(out).toBe("So1anaAddr");
	});

	it("getEmbeddedSolanaAddressFromLinkedAccounts returns null when absent", () => {
		const out = getEmbeddedSolanaAddressFromLinkedAccounts([
			{
				type: "wallet",
				chainType: "solana",
				walletClientType: "phantom",
				address: "X",
			},
		]);
		expect(out).toBeNull();
	});
});
