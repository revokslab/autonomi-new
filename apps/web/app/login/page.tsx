"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { FaXTwitter } from "react-icons/fa6";
import { OTPInput, type SlotProps } from "input-otp";
import { useState, useRef, useEffect } from "react";

type Step = "email" | "otp" | "verifying" | "onboard";

export default function LoginPage() {
	const [step, setStep] = useState<Step>("email");
	const [email, setEmail] = useState("");
	const emailInputRef = useRef<HTMLInputElement>(null);

	const handleContinue = () => {
		const value = emailInputRef.current?.value?.trim();
		if (value) {
			setEmail(value);
			setStep("otp");
		}
	};

	const handleResendCode = () => {
		// TODO: call resend API with email
	};

	// Auto-advance from verifying to onboard after 2s
	useEffect(() => {
		if (step !== "verifying") return;
		const t = setTimeout(() => setStep("onboard"), 2000);
		return () => clearTimeout(t);
	}, [step]);

	const handleConnectWallet = () => {
		// TODO: integrate wallet connection
	};

	return (
		<main className="min-h-dvh sm:min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 overflow-x-hidden">
			<div className="w-full max-w-md min-w-0 flex flex-col items-center">
				{/* Login section: Welcome + email/OTP/verifying + OAuth (hidden on onboard) */}
				{step !== "onboard" && (
					<>
						<h1
							className="text-[#FAFAFA] text-lg sm:text-xl md:text-lg mb-3 text-center"
							style={{ fontFamily: "'Hedvig Serif', serif" }}
						>
							Welcome to Autonomi
						</h1>
						<p className="font-sans text-sm text-[#878787] mb-6 sm:mb-8 text-center">
							Sign in or create an account
						</p>
						<div
							className="w-full min-w-0 flex flex-col gap-3"
							style={{ fontFamily: "'Hedvig Sans', sans-serif" }}
						>
							{step === "email" && (
								<>
									<input
										ref={emailInputRef}
										id="email"
										type="email"
										placeholder="Enter email address"
										className="flex min-h-[44px] sm:h-9 w-full border border-[#1C1C1C] bg-transparent px-3 py-2 sm:py-1 text-base sm:text-sm text-[#FAFAFA] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#878787] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&:-webkit-autofill]:!bg-transparent [&:-webkit-autofill]:!bg-none [&:-webkit-autofill]:!shadow-none rounded-none"
									/>
									<button
										type="button"
										onClick={handleContinue}
										className="flex items-center justify-center text-sm transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-white/90 relative bg-white px-6 py-3 sm:py-4 text-[#0e0e0e] font-medium min-h-[44px] sm:h-[40px] w-full rounded-none cursor-pointer"
									>
										Continue
									</button>
								</>
							)}
							{step === "otp" && (
								<>
									<div className="login-otp-wrap h-[62px] w-full flex items-center justify-center">
										<OTPInput
											maxLength={6}
											containerClassName="flex items-center gap-2 cursor-text select-none [&_input]:!outline-none [&_input]:!ring-0 [&_input]:!ring-offset-0 [&_input]:focus:!outline-none [&_input]:focus:!ring-0 [&_input]:focus-visible:!outline-none [&_input]:focus-visible:!ring-0 [&_input]:!shadow-none"
											className="!outline-none !ring-0 !ring-offset-0 !shadow-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0"
											onComplete={() => setStep("verifying")}
											render={({ slots }: { slots: SlotProps[] }) => (
												<div className="flex items-center">
													{slots.map((slot: SlotProps, idx: number) => (
														<OTPSlot key={idx} {...slot} />
													))}
												</div>
											)}
										/>
									</div>
									<div className="flex items-center justify-center gap-2 mt-2">
										<span className="text-sm text-[#878787]">
											Didn&apos;t receive the email?
										</span>
										<button
											type="button"
											onClick={handleResendCode}
											className="text-sm text-[#FAFAFA] underline font-medium hover:text-[#E7E7E7] transition-colors cursor-pointer"
										>
											Resend code
										</button>
									</div>
								</>
							)}
							{step === "verifying" && (
								<div className="h-[62px] w-full flex items-center justify-center">
									<div className="flex items-center space-x-2">
										<svg
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											viewBox="0 0 24 24"
											strokeLinecap="round"
											strokeLinejoin="round"
											xmlns="http://www.w3.org/2000/svg"
											className="animate-spin text-[#878787]"
											style={{ width: 16, height: 16 }}
										>
											<path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12" />
										</svg>
										<span className="text-sm text-[#FAFAFA] font-medium">
											Verifying...
										</span>
									</div>
								</div>
							)}

							<div className="flex items-center gap-4 my-2">
								<div className="flex-1 min-w-0 h-px bg-[#1C1C1C]" />
								<span className="text-[#878787] text-sm shrink-0">or</span>
								<div className="flex-1 min-w-0 h-px bg-[#1C1C1C]" />
							</div>
							<button className="inline-flex items-center justify-center gap-3 font-medium focus-visible:outline-none disabled:pointer-events-none relative w-full bg-transparent border border-[#1C1C1C] text-[#FAFAFA] font-sans text-sm min-h-[44px] sm:h-[40px] px-4 sm:px-6 py-3 sm:py-4 hover:bg-[#1C1C1C]/10 transition-colors disabled:opacity-50 cursor-pointer">
								<GoogleIcon />
								<span>Continue with Google</span>
							</button>
							<button className="inline-flex items-center justify-center gap-3 font-medium focus-visible:outline-none disabled:pointer-events-none relative w-full bg-transparent border border-[#1C1C1C] text-[#FAFAFA] font-sans text-sm min-h-[44px] sm:h-[40px] px-4 sm:px-6 py-3 sm:py-4 hover:bg-[#1C1C1C]/10 transition-colors disabled:opacity-50 cursor-pointer">
								<FaXTwitter className="w-4 h-4 shrink-0" />
								<span>Continue with Twitter</span>
							</button>
						</div>
					</>
				)}

				{/* Onboard section: wallet connect only (no Welcome, no OAuth) */}
				{step === "onboard" && (
					<div
						className="w-full min-w-0 flex flex-col gap-4 items-center"
						style={{ fontFamily: "'Hedvig Sans', sans-serif" }}
					>
						<h1
							className="text-[#FAFAFA] text-lg sm:text-xl md:text-lg mb-2 text-center"
							style={{ fontFamily: "'Hedvig Serif', serif" }}
						>
							Connect your wallet
						</h1>
						<p className="text-sm text-[#878787] mb-2 text-center">
							Link your web3 wallet to get started.
						</p>
						<button
							type="button"
							onClick={handleConnectWallet}
							className="inline-flex items-center justify-center gap-3 font-medium focus-visible:outline-none relative w-full bg-[#0e0e0e] border border-[#1C1C1C] text-[#FAFAFA] text-sm min-h-[44px] sm:h-[40px] px-4 sm:px-6 py-3 sm:py-4 hover:bg-[#1a1a1a] transition-colors rounded-none cursor-pointer"
						>
							<HugeiconsIcon
								icon={Wallet01Icon}
								size={20}
								className="shrink-0"
							/>
							<span>Connect wallet</span>
						</button>
						<button
							type="button"
							className="text-sm text-[#878787] hover:text-[#FAFAFA] transition-colors cursor-pointer underline font-medium"
						>
							Skip for now
						</button>
					</div>
				)}

				{/* Footer */}
				<p className="font-sans text-xs text-[#878787] mt-8 sm:mt-12 md:mt-16 text-center w-full px-1 sm:px-0">
					By signing in you agree to our{" "}
					<a
						href="#"
						className="text-[#878787] hover:text-[#FAFAFA] transition-colors underline"
					>
						Terms of service
					</a>{" "}
					&{" "}
					<a
						href="#"
						className="text-[#878787] hover:text-[#FAFAFA] transition-colors underline"
					>
						Privacy policy
					</a>
				</p>
			</div>
		</main>
	);
}

function OTPSlot(props: SlotProps) {
	return (
		<div
			className="relative flex items-center justify-center border-y border-r border-[#1C1C1C] text-2xl text-[#FAFAFA] transition-all first:border-l w-[62px] h-[62px]"
			style={{ fontFamily: "'Hedvig Sans', sans-serif" }}
		>
			<span className="relative z-[1]">
				{props.char ?? props.placeholderChar}
			</span>
			{props.hasFakeCaret && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-px h-8 bg-[#FAFAFA] animate-caret-blink" />
				</div>
			)}
		</div>
	);
}

function GoogleIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
				fill="#4285F4"
			/>
			<path
				d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
				fill="#34A853"
			/>
			<path
				d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
				fill="#FBBC05"
			/>
			<path
				d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
				fill="#EA4335"
			/>
		</svg>
	);
}
