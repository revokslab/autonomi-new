import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "assets.coingecko.com",
				pathname: "/coins/images/**",
			},
		],
	},
};

export default nextConfig;
