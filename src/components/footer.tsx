import Link from "next/link";

export default function Footer() {
	return (
		<footer className="flex w-full flex-col items-center justify-between gap-8 border-foreground border-t-4 bg-card px-8 py-8 font-jaro text-gray-400 text-lg tracking-wide md:flex-row">
			<div className="flex flex-col items-center gap-2 md:flex-row">
				<span>&copy; 2026 Industrial.io</span>
			</div>
			<nav className="flex flex-wrap items-center justify-center gap-6 md:justify-end">
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
