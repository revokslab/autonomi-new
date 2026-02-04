"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from "recharts";

type MetricCardProps = {
	title: string;
	value: string;
	change: number;
	changeLabel: string;
	trend: "up" | "down";
	chartData?: { value: number }[];
};

const defaultChartData = [
	{ value: 40 },
	{ value: 60 },
	{ value: 45 },
	{ value: 70 },
	{ value: 55 },
	{ value: 80 },
	{ value: 65 },
];

export function MetricCard({
	title,
	value,
	change,
	changeLabel,
	trend,
	chartData = defaultChartData,
}: MetricCardProps) {
	const isUp = trend === "up";
	const changeColor = isUp ? "#34C759" : "#FF383C";

	return (
		<div className="flex w-[311px] shrink-0 flex-col gap-6 rounded-none border border-[#1E1E1E] bg-[#0C0C0C] p-6 shadow-sm">
			<span
				className="text-[11.82px] leading-6 text-[#B2B2B2]"
				style={{
					fontFamily:
						"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
				}}
			>
				{title}
			</span>
			<div className="flex items-end gap-4">
				<div className="flex flex-1 flex-col gap-4">
					<span
						className="font-mono text-[23.64px] leading-[43px] tracking-[-0.02em] text-[#FAFAFA]"
						style={{ fontFamily: "var(--font-geist-mono), monospace" }}
					>
						{value}
					</span>
					<div className="flex items-center gap-2">
						{isUp ? (
							<TrendingUp
								className="h-5 w-5 shrink-0"
								style={{ color: changeColor }}
								strokeWidth={1}
							/>
						) : (
							<TrendingDown
								className="h-5 w-5 shrink-0"
								style={{ color: changeColor }}
								strokeWidth={1}
							/>
						)}
						<span
							className="text-xs leading-5"
							style={{
								color: changeColor,
								fontFamily: "var(--font-geist-mono)",
							}}
						>
							{change}%
						</span>
						<span
							className="text-[11.82px] leading-5 text-[#B2B2B2]"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							{changeLabel}
						</span>
					</div>
				</div>
				<div className="h-[63px] w-[126px] shrink-0">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={chartData}
							margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
						>
							<defs>
								<linearGradient
									id={`fill-${title.replace(/\s/g, "-")}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop offset="0%" stopColor="#94969C" stopOpacity={0.3} />
									<stop offset="100%" stopColor="#94969C" stopOpacity={0} />
								</linearGradient>
							</defs>
							<YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
							<Tooltip content={<></>} />
							<Area
								type="monotone"
								dataKey="value"
								stroke="#94969C"
								strokeWidth={2}
								fill={`url(#fill-${title.replace(/\s/g, "-")})`}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}
