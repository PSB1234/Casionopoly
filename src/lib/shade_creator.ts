/**
 * Lightens or darkens a hex color.
 * @param hex The 6-character hex color (e.g., "#3498db").
 * @param percent The percentage to lighten (positive) or darken (negative) (e.g., 20 or -20).
 * @returns The gathered hex string.
 */
export const adjustColorShade = (hex: string, percent: number): string => {
    // Ensure the hash is removed
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // Convert to 3 chars to 6 chars if needed
    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate new values
    const adjust = (val: number) => {
        let newVal = parseInt(Math.floor((val * (100 + percent)) / 100).toString());
        newVal = newVal < 0 ? 0 : newVal > 255 ? 255 : newVal;
        // Convert back to hex and pad with zero if needed
        const hexVal = newVal.toString(16);
        return hexVal.length === 1 ? '0' + hexVal : hexVal;
    };

    return `#${adjust(r)}${adjust(g)}${adjust(b)}`;
};

