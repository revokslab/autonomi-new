"use client";

import { Send, Plus } from "lucide-react";
import { useState } from "react";

type FloatingChatInputProps = {
	value?: string;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
};

export function FloatingChatInput({
	value: controlledValue,
	onChange,
	onSubmit,
}: FloatingChatInputProps) {
	const [internalValue, setInternalValue] = useState("");
	const value = controlledValue ?? internalValue;
	const setValue = onChange ?? setInternalValue;

	const handleSubmit = () => {
		const v = value.trim();
		if (!v) return;
		onSubmit?.(v);
		setValue("");
	};

	return (
		<div className="sticky bottom-0 left-0 right-0 z-10 flex justify-center px-6 pb-6 pt-4">
			<div className="flex w-full max-w-[574px] items-center gap-3 rounded-sm border border-neutral-300 bg-white px-4 py-3 shadow-sm">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700">
					<Plus className="h-4 w-4" strokeWidth={2} />
				</div>
				<input
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
					placeholder="What can I help with?"
					className="min-w-0 flex-1 border-0 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
					style={{
						fontFamily:
							"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
					}}
					aria-label="Chat input"
				/>
				<button
					type="button"
					onClick={handleSubmit}
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-300 hover:text-neutral-900"
					aria-label="Send"
				>
					<Send className="h-4 w-4" strokeWidth={2} />
				</button>
			</div>
		</div>
	);
}
