interface RGB {
	r: number;
	g: number;
	b: number;
}

interface ColorPair {
	original: string;
	lighter: string;
}

/**
 * Generates a random RGB color
 */
function generateRandomColor(): RGB {
	return {
		r: Math.floor(Math.random() * 256),
		g: Math.floor(Math.random() * 256),
		b: Math.floor(Math.random() * 256),
	};
}

/**
 * Converts RGB values to hex color string
 */
function rgbToHex(r: number, g: number, b: number): string {
	return (
		"#" +
		[r, g, b]
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? `0${hex}` : hex;
			})
			.join("")
	);
}

/**
 * Creates a lighter version of an RGB color
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @param amount - How much lighter (0-1), default 0.4
 */
export function lightenColor(
	r: number,
	g: number,
	b: number,
	amount: number = 0.4,
): RGB {
	return {
		r: Math.min(255, Math.floor(r + (255 - r) * amount)),
		g: Math.min(255, Math.floor(g + (255 - g) * amount)),
		b: Math.min(255, Math.floor(b + (255 - b) * amount)),
	};
}

/**
 * Main function: Generates a random color and its lighter version
 * @param lightenAmount - How much lighter the second color should be (0-1)
 * @returns Object with original and lighter hex colors
 */
export function generateColorPair(lightenAmount: number = 0.4): ColorPair {
	const original = generateRandomColor();
	const lighter = lightenColor(
		original.r,
		original.g,
		original.b,
		lightenAmount,
	);

	return {
		original: rgbToHex(original.r, original.g, original.b),
		lighter: rgbToHex(lighter.r, lighter.g, lighter.b),
	};
}

// Example usage in a React component:
// const { original, lighter } = generateColorPair();
// <div style={{ backgroundColor: original }}>Original Color</div>
// <div style={{ backgroundColor: lighter }}>Lighter Color</div>
