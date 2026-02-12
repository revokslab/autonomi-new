"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function PrivyProviderWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
	if (!appId) {
		console.warn(
			"NEXT_PUBLIC_PRIVY_APP_ID is not set; Privy auth will not work.",
		);
	}
	return (
		<PrivyProvider
			appId={appId ?? ""}
			config={{
				loginMethods: ["email", "google", "twitter", "wallet"],
				appearance: {
					theme: "light",
				},
				embeddedWallets: {
					ethereum: {
						createOnLogin: "off",
					},
					solana: {
						createOnLogin: "all-users",
					},
				},
			}}
		>
			{children}
		</PrivyProvider>
	);
}
