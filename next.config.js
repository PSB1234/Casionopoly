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
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
			},
			{
				source: "/socket.io/:path*",
				destination: `${process.env.NEXT_PUBLIC_SOCKET_URL}/socket.io/:path*`,
			},
		];
	},
};

export default config;
