export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-dvh sm:min-h-screen bg-white overflow-x-hidden">
			{children}
		</div>
	);
}
