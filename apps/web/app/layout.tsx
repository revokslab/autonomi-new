import type { Metadata } from "next";
import {
	DM_Mono,
	Geist,
	Geist_Mono,
	Hedvig_Letters_Sans,
	Hedvig_Letters_Serif,
	Inter,
} from "next/font/google";
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

const hedvigLettersSans = Hedvig_Letters_Sans({
	variable: "--font-hedvig-letters-sans",
	subsets: ["latin"],
	weight: "400",
});

const hedvigLettersSerif = Hedvig_Letters_Serif({
	variable: "--font-hedvig-letters-serif",
	subsets: ["latin"],
	weight: "400",
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
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${kaliceFont.variable} ${dmMono.variable} ${hedvigLettersSans.variable} ${hedvigLettersSerif.variable} antialiased`}
			>
				{children}
				<div
					className="fixed inset-0 z-50 h-screen w-full bg-[url('/grain.jpg')] bg-repeat bg-auto opacity-[0.04] pointer-events-none select-none"
					aria-hidden
				/>
			</body>
		</html>
	);
}
