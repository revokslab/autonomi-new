"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Header } from "@/components/dashboard/Header";

const suggestions = [
	"Farm rewards with a swap",
	"What can I do on Autonomi?",
	"How to get rewards in Autonomi?",
	"What are AI Agents?",
];

export default function ChatPage() {
	const [inputValue, setInputValue] = useState("");

	const handleSend = () => {
		const v = inputValue.trim();
		if (!v) return;
		// TODO: send message
		setInputValue("");
	};

	return (
		<>
			<Header />
			<div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
				{/* Subtle ambient gradient at bottom */}
				<div
					className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-emerald-50/50 to-transparent"
					aria-hidden
				/>

				<div className="relative flex w-full max-w-[560px] flex-col items-center gap-8">
					<h1
						className="text-center text-2xl font-medium text-neutral-900 sm:text-3xl"
						style={{
							fontFamily:
								"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
						}}
					>
						What can I help with?
					</h1>

					<div className="w-full">
						<div className="flex items-center gap-2 rounded-sm border border-neutral-300 bg-white pr-2 focus-within:ring-2 focus-within:ring-neutral-400 focus-within:ring-offset-0">
							<input
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSend()}
								placeholder="Ask me anything..."
								className="min-w-0 flex-1 border-0 bg-transparent px-4 py-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
								aria-label="Chat input"
							/>
							<button
								type="button"
								onClick={handleSend}
								className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-300 hover:text-neutral-900"
								aria-label="Send"
							>
								<Send className="h-4 w-4" strokeWidth={2} />
							</button>
						</div>

						<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
							{suggestions.map((label) => (
								<button
									key={label}
									type="button"
									onClick={() => setInputValue(label)}
									className="rounded-full border border-neutral-300 bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-200"
									style={{
										fontFamily:
											"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
									}}
								>
									{label}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
