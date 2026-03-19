import { describe, expect, it } from "vitest";

import {
	computeUnrealizedPnlUsd,
	derivePositions,
	type ExecutedSwap,
} from "../pnl";

describe("pnl", () => {
	it("derives positions and unrealized pnl from swaps", () => {
		const swaps: ExecutedSwap[] = [
			{
				id: "1",
				ts: 1,
				signature: "sig1",
				inMint: "So11111111111111111111111111111111111111112",
				outMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
				inAmountAtomic: "1000000000",
				outAmountAtomic: "180000000",
			},
			{
				id: "2",
				ts: 2,
				signature: "sig2",
				inMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
				outMint: "So11111111111111111111111111111111111111112",
				inAmountAtomic: "90000000",
				outAmountAtomic: "500000000",
			},
		];

		const prices = {
			So11111111111111111111111111111111111111112: 200,
			EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 1,
		};

		const positions = derivePositions(swaps, prices);
		const solPos = positions.find(
			(p) => p.mint === "So11111111111111111111111111111111111111112",
		);
		expect(solPos).toBeTruthy();
		if (!solPos) return;
		expect(solPos.quantity).toBeGreaterThan(0);

		const pnl = computeUnrealizedPnlUsd(positions, prices);
		expect(Number.isFinite(pnl)).toBe(true);
	});
});
