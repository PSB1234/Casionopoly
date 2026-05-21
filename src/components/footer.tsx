import Link from "next/link";

export default function Footer() {
	return (
		<footer className="flex w-full flex-col items-center justify-between gap-6 md:gap-8 border-foreground border-t-4 bg-card px-4 md:px-8 py-6 md:py-8 font-jaro text-gray-400 text-base md:text-lg tracking-wide md:flex-row text-center md:text-left">
			<div className="flex flex-col items-center gap-2 md:flex-row">
				<span>&copy; 2026 casionopoly</span>
			</div>
			<nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 md:justify-end">
			<Link className="transition-colors hover:text-white" href="/credits-and-licenses">
				Credits & Licenses
				</Link>
				<Link
					className="transition-colors hover:text-white"
					href="/privacy-policy"
				>
					Privacy & Cookies
				</Link>
			</nav>
		</footer>
	);
}
