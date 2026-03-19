"use client";

import { Header } from "@/components/dashboard/Header";

export default function TerminalPage() {
	return (
		<>
			<Header />
			<div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
				<h1
					className="text-xl text-neutral-900"
					style={{
						fontFamily:
							"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
					}}
				>
					Terminal
				</h1>
				<p className="mt-2 text-sm text-neutral-500">Coming soon.</p>
			</div>
		</>
	);
}
