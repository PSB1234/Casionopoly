import Image from "next/image";
import pc from "public/Images/back.webp";
import mobile from "public/Images/back_mobile.webp";
export default function Background() {
	return (
		<span className="fixed inset-0 -z-50">
			<Image
				alt="Night City"
				className="hidden md:block"
				fill
				placeholder="blur"
				quality={100}
				sizes="100vw"
				src={pc}
				style={{
					objectFit: "cover",
				}}
			/>
			<Image
				alt="Night City"
				className="block md:hidden"
				fill
				placeholder="blur"
				quality={100}
				sizes="100vw"
				src={mobile}
				style={{
					objectFit: "cover",
				}}
			/>
		</span>
	);
}
