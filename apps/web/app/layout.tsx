import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const kaliceFont = localFont({
	src: "../public/fonts/Kalice-Trial-Regular.ttf",
	variable: "--font-hero",
	display: "swap",
	weight: "400",
});

const dmMono = DM_Mono({
	weight: ["300", "400", "500"],
	variable: "--font-dm-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Autonomi",
	description: "The first AI-native Agentic wallet",
	other: {
		"font-preload": "true",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin=""
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Hedvig+Letters+Sans&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${kaliceFont.variable} ${dmMono.variable} antialiased`}
			>
				{children}
				<div
					className="fixed inset-0 z-50 h-screen w-full bg-[url('/grain.jpg')] bg-repeat bg-[length:auto] opacity-[0.04] pointer-events-none select-none"
					aria-hidden
				/>
			</body>
		</html>
	);
}
