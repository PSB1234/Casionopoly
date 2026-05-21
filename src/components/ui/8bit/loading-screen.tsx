export default function LoadingScreen() {
	return (
		<div className="fixed inset-0 z-100 flex h-screen w-screen flex-col items-center justify-center text-center">
			<div className="absolute inset-0 bg-background" />
			<div className="relative">
				<h1 className="relative z-10 font-bold font-jaro text-5xl md:text-9xl text-yellow-200">
					Casionopoly
				</h1>
				<div className="pointer-events-none absolute top-1 left-1 md:top-2 md:left-2 select-none font-bold font-jaro text-5xl md:text-9xl text-black">
					Casionopoly
				</div>
			</div>
			<div className="relative">
				<h2 className="relative z-10 font-bold font-jaro text-2xl md:text-4xl text-yellow-200">
					Loading...
				</h2>
				<div className="pointer-events-none absolute top-1 left-1 md:top-2 md:left-2 select-none font-bold font-jaro text-2xl md:text-4xl text-black">
					Loading...
				</div>
			</div>
		</div>
	);
}
