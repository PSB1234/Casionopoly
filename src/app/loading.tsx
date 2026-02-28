export default function Loading() {
	return (
		<div className="flex h-full min-h-screen w-full min-w-screen flex-col items-center justify-center text-center blur-2xl">
			<div className="relative">
				<h1 className="relative z-10 font-bold font-jaro text-9xl text-yellow-200">
					Industrial.io
				</h1>
				<div className="pointer-events-none absolute top-1 left-1 select-none font-bold font-jaro text-9xl text-black">
					Industrial.io
				</div>
			</div>
			<div className="relative">
				<h2 className="relative z-10 font-bold font-jaro text-4xl text-yellow-200">
					Loading...
				</h2>
				<div className="pointer-events-none absolute top-1 left-1 select-none font-bold font-jaro text-4xl text-black">
					Loading...
				</div>
			</div>
		</div>
	);
}
