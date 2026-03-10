"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { ButtonWithCorners } from "./_components/button-with-corners";
import { Keycap } from "./_components/keycap";
import { GitHub, XformerlyTwitter } from "@/components/svg";

const hotkeysOptions = {
	preventDefault: true,
	enableOnFormTags: false,
};

export default function Home() {
	const year = useMemo(() => new Date().getFullYear(), []);
	const router = useRouter();

	// D - Demo: scroll to #demo
	useHotkeys(
		"d, D",
		() =>
			document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }),
		hotkeysOptions,
	);

	// L - Login: navigate to /login
	useHotkeys("l, L", () => router.push("/login"), hotkeysOptions);

	// G - Get Started: scroll to #book
	useHotkeys(
		"g, G",
		() =>
			document.getElementById("book")?.scrollIntoView({ behavior: "smooth" }),
		hotkeysOptions,
	);

	return (
		<div className="flex h-screen min-h-0 flex-col overflow-hidden text-neutral-900">
			<header className="shrink-0 px-6 py-3">
				<div className="mx-auto flex w-full max-w-5xl items-center justify-between">
					<Link href="/" className="flex items-center" aria-label="Home">
						<Image
							src="/logo.svg"
							alt=""
							width={32}
							height={32}
							className="h-8 w-8 object-contain invert"
						/>
					</Link>
					<nav className="flex items-center gap-6">
						<ButtonWithCorners>
							<Link
								href="#demo"
								className="flex items-center gap-2 rounded-sm border border-neutral-300 bg-transparent px-6 py-2 text-sm font-normal text-neutral-900 transition hover:bg-neutral-100/80"
								style={{ fontFamily: "var(--font-dm-mono), monospace" }}
							>
								Demo <Keycap letter="D" />
							</Link>
						</ButtonWithCorners>
						<ButtonWithCorners>
							<Link
								href="/login"
								className="flex items-center gap-2 rounded-md border border-neutral-300 bg-transparent px-6 py-2 text-sm font-normal text-neutral-900 transition hover:bg-neutral-100/80"
								style={{ fontFamily: "var(--font-dm-mono), monospace" }}
							>
								Login <Keycap letter="L" />
							</Link>
						</ButtonWithCorners>
					</nav>
				</div>
			</header>

			<main
				id="demo"
				className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-6 text-center"
			>
				<div className="mb-3 flex w-full justify-center">
					<ButtonWithCorners>
						<p
							className="flex flex-wrap items-center justify-center gap-1.5 py-2 px-3 text-sm text-neutral-600"
							style={{ fontFamily: "var(--font-dm-mono), monospace" }}
						>
							<span
								className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-black"
								aria-hidden
							>
								<svg width="14" height="14" viewBox="0 0 12 12" fill="none">
									<title>Star</title>
									<path
										d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
										fill="#FF9400"
									/>
								</svg>
							</span>
							<span>Backed by</span>
							<span className="font-medium text-[#FF6B52]">bags</span>
							<span>.fm</span>
						</p>
					</ButtonWithCorners>
				</div>

				<h1
					className="mb-3 max-w-4xl whitespace-nowrap text-[clamp(2rem,5vw,5rem)] font-normal leading-tight tracking-tight text-neutral-900 sm:whitespace-normal"
					style={{
						fontFamily: "var(--font-hero), serif",
						fontWeight: 400,
					}}
				>
					Your wallet got a brain,
					<br className="hidden sm:block" /> Now it thinks.
				</h1>

				<p
					className="mb-4 max-w-2xl text-sm text-neutral-600"
					style={{
						fontFamily: "var(--font-dm-mono), monospace",
						lineHeight: "1.2em",
					}}
				>
					Beyond a wallet, it’s your crypto agent that thinks, trades, stakes
					and manage assets while you focus on what matters — just command.
				</p>

				<div id="book">
					<ButtonWithCorners>
						<Link
							href="#book"
							className="inline-flex items-center gap-2 rounded-none border border-neutral-300 bg-transparent px-8 py-3 text-sm font-normal text-neutral-900 transition hover:bg-neutral-100/80"
							style={{ fontFamily: "var(--font-dm-mono), monospace" }}
						>
							Get Started <Keycap letter="G" />
						</Link>
					</ButtonWithCorners>
				</div>
			</main>
			<footer className="shrink-0 px-6 py-3">
				<div className="mx-auto flex w-full max-w-full items-center justify-between">
					<Link
						href="https://revoks.dev"
						className="text-sm font-dm-mono"
						target="_blank"
						rel="noopener noreferrer"
					>
						&copy; {year} The Revoks Company.
					</Link>
					<div className="flex items-center gap-4">
						<Link
							href="https://x.com/autonomidotrun"
							target="_blank"
							rel="noopener noreferrer"
						>
							<XformerlyTwitter className="h-4 w-4 shrink-0" aria-hidden />
						</Link>
						<Link
							href="https://github.com/revokslab/autonomi-new"
							target="_blank"
							rel="noopener noreferrer"
						>
							<GitHub className="h-5 w-5 shrink-0 text-gray-800" aria-hidden />
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
