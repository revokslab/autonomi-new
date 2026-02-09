// === Discriminated Union for Tool Results ===
export type ToolResultTypes =
	| {
			toolName: "execute-trade";
			result: {
				success: boolean;
				message: string;
			};
	  }
	| {
			toolName: "get-crypto-price";
			result: {
				price: number;
				currency: string;
			};
	  }
	| {
			toolName: "get-crypto-price-history";
			result: {
				priceHistory: {
					timestamp: string;
					price: number;
				}[];
			};
	  };
