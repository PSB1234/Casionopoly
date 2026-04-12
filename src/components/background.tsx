import Image from "next/image";
export default function Background() {
	return (
		<span className="fixed inset-0 -z-50">
			<Image
				alt="Night City"
				className="hidden md:block"
				fill
				quality={100}
				sizes="100vw"
				src={"/Images/back.webp"}
				style={{
					objectFit: "cover",
				}}
			/>
			<Image
				alt="Night City"
				className="block md:hidden"
				fill
				quality={100}
				sizes="100vw"
				src={"/Images/back_mobile.webp"}
				style={{
					objectFit: "cover",
				}}
			/>
		</span>
	);
}
