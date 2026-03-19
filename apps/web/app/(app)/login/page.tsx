"use client";

import {
	useLoginWithEmail,
	useLoginWithOAuth,
	usePrivy,
} from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";

function GoogleIcon() {
	return (
		<svg
			aria-hidden
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Google</title>
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

export default function LoginPage() {
	const router = useRouter();
	const { ready, authenticated, login: openLoginModal } = usePrivy();
	const { sendCode, loginWithCode, state: emailState } = useLoginWithEmail();
	const { initOAuth } = useLoginWithOAuth();

	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [emailStep, setEmailStep] = useState<"input" | "code">("input");

	// Redirect to dashboard when already authenticated
	useEffect(() => {
		if (ready && authenticated) {
			router.replace("/dashboard");
		}
	}, [ready, authenticated, router]);

	const handleEmailContinue = async () => {
		const value = email.trim();
		if (!value) return;
		try {
			await sendCode({ email: value });
			setEmailStep("code");
		} catch (err) {
			console.error("Failed to send code:", err);
		}
	};

	const handleCodeSubmit = async () => {
		const value = code.trim();
		if (!value) return;
		try {
			await loginWithCode({ code: value });
			// useEffect will redirect when authenticated
		} catch (err) {
			console.error("Failed to verify code:", err);
		}
	};

	const handleGoogle = () => initOAuth({ provider: "google" });
	const handleTwitter = () => initOAuth({ provider: "twitter" });
	const handleConnectWallet = () => openLoginModal();

	const isLoading =
		emailState === "sending-code" || emailState === "submitting-code" || !ready;

	return (
		<main className="min-h-dvh sm:min-h-screen flex overflow-x-hidden">
			{/* Left: form */}
			<div className="w-full min-w-0 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 md:min-w-[420px] md:shrink-0 md:border-r border-neutral-200 bg-white lg:basis-[55%] lg:flex-grow-0 lg:flex-shrink-0">
				<div className="w-full max-w-sm flex flex-col items-center">
					<img
						src="/logo.svg"
						alt=""
						className="mb-6 h-8 w-8 shrink-0 object-contain invert"
					/>
					<h1
						className="text-neutral-900 text-xl md:text-2xl mb-2 text-center"
						style={{ fontFamily: "var(--font-hedvig-serif), serif" }}
					>
						Welcome to Autonomi
					</h1>
					<p className="text-neutral-500 text-sm mb-6 text-center">
						Sign in or create an account
					</p>

					<div
						className="w-full min-w-0 flex flex-col gap-3"
						style={{ fontFamily: "var(--font-hedvig-sans), sans-serif" }}
					>
						{emailStep === "input" && (
							<>
								<label htmlFor="email" className="sr-only">
									Email
								</label>
								<input
									id="email"
									type="email"
									placeholder="name@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="flex min-h-[44px] w-full border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-0 rounded-sm"
								/>
								<button
									type="button"
									onClick={handleEmailContinue}
									disabled={isLoading || !email.trim()}
									className="flex items-center justify-center text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none min-h-[44px] w-full rounded-sm cursor-pointer transition-colors"
								>
									{emailState === "sending-code" ? "Sending…" : "Continue"}
								</button>
							</>
						)}
						{emailStep === "code" && (
							<>
								<label htmlFor="code" className="sr-only">
									Verification code
								</label>
								<input
									id="code"
									type="text"
									inputMode="numeric"
									placeholder="Enter 6-digit code"
									value={code}
									onChange={(e) =>
										setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
									}
									className="flex min-h-[44px] w-full border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-0 rounded-sm"
								/>
								<button
									type="button"
									onClick={handleCodeSubmit}
									disabled={isLoading || code.length < 6}
									className="flex items-center justify-center text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none min-h-[44px] w-full rounded-sm cursor-pointer transition-colors"
								>
									{emailState === "submitting-code" ? "Verifying…" : "Verify"}
								</button>
								<button
									type="button"
									onClick={() => setEmailStep("input")}
									className="text-sm text-neutral-500 hover:text-neutral-700 underline"
								>
									Use a different email
								</button>
							</>
						)}

						<div className="flex items-center gap-4 my-2">
							<div className="flex-1 min-w-0 h-px bg-neutral-200" />
							<span className="text-neutral-400 text-sm shrink-0">OR</span>
							<div className="flex-1 min-w-0 h-px bg-neutral-200" />
						</div>

						<button
							type="button"
							onClick={handleGoogle}
							disabled={!ready}
							className="inline-flex items-center justify-center gap-3 font-medium text-neutral-900 bg-white border border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none disabled:opacity-50 min-h-[44px] w-full px-4 py-3 rounded-sm cursor-pointer transition-colors"
						>
							<GoogleIcon />
							<span>Continue with Google</span>
						</button>
						<button
							type="button"
							onClick={handleTwitter}
							disabled={!ready}
							className="inline-flex items-center justify-center gap-3 font-medium text-neutral-900 bg-white border border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none disabled:opacity-50 min-h-[44px] w-full px-4 py-3 rounded-sm cursor-pointer transition-colors"
						>
							<FaXTwitter className="w-4 h-4 shrink-0" />
							<span>Continue with X</span>
						</button>
						<button
							type="button"
							onClick={handleConnectWallet}
							disabled={!ready}
							className="inline-flex items-center justify-center gap-3 font-medium text-neutral-900 bg-white border border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none disabled:opacity-50 min-h-[44px] w-full px-4 py-3 rounded-sm cursor-pointer transition-colors"
						>
							<svg
								className="w-4 h-4 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Wallet</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
								/>
							</svg>
							<span>Connect wallet</span>
						</button>
					</div>

					<p className="font-sans text-xs text-neutral-400 mt-8 text-center w-full">
						By signing in you agree to our{" "}
						<Link
							href="#"
							className="text-neutral-500 hover:text-neutral-700 underline"
						>
							Terms of service
						</Link>{" "}
						&{" "}
						<Link
							href="#"
							className="text-neutral-500 hover:text-neutral-700 underline"
						>
							Privacy policy
						</Link>
					</p>
				</div>
			</div>

			{/* Right: image - hidden on phones/small screens, show from lg */}
			<div className="hidden lg:block flex-1 min-h-0 relative bg-neutral-100">
				<Image
					src="/login.jpeg"
					alt=""
					fill
					className="object-cover object-center"
					priority
					sizes="(min-width: 768px) 50vw, 0px"
				/>
			</div>
		</main>
	);
}
