/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	output: "standalone",
	experimental: {
		useCache: true,
	},
	images: {
		qualities: [25, 50, 75, 100],
	},
};

export default config;
