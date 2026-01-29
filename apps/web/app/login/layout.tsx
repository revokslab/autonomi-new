export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-dvh sm:min-h-screen bg-[#0C0C0C] overflow-x-hidden">
			{children}
		</div>
	);
}
