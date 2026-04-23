import Image from "next/image";
import { useState } from "react";
export default function Sounds() {
	const [isSoundOn, setIsSoundOn] = useState(true);
	const handleSoundToggle = () => {
		setIsSoundOn(!isSoundOn);
	};
	return (
		<div>
			<div className="relative">
				<h1 className="relative z-10">
					<Image
						alt="Sound On Foreground"
						className="pixelated"
						height={36}
						hidden={!isSoundOn}
						onClick={handleSoundToggle}
						src={"/icons/sound-on-solid-foreground.svg"}
						width={30}
						style={{ width: 30, height: 36 }}
					/>
				</h1>
				<div className="pointer-events-none absolute top-2 left-2 select-none">
					<Image
						alt="Sound On Background"
						className="pixelated"
						height={36}
						hidden={!isSoundOn}
						onClick={handleSoundToggle}
						src={"/icons/sound-on-solid.svg"}
						width={30}
						style={{ width: 30, height: 36 }}
					/>
				</div>
			</div>
			<div className="relative">
				<h1 className="relative z-10">
					<Image
						alt="Sound Off Foreground"
						className="pixelated"
						height={36}
						hidden={isSoundOn}
						onClick={handleSoundToggle}
						src={"/icons/sound-mute-solid-foreground.svg"}
						width={30}
						style={{ width: 30, height: 36 }}
					/>
				</h1>
				<div className="pointer-events-none absolute top-2 left-2 select-none">
					<Image
						alt="Sound Off Background"
						className="pixelated"
						height={36}
						hidden={isSoundOn}
						onClick={handleSoundToggle}
						src={"/icons/sound-mute-solid.svg"}
						width={30}
						style={{ width: 30, height: 36 }}
					/>
				</div>
			</div>
		</div>
	);
}
