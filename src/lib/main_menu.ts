import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const getMenuItems = (
	router: AppRouterInstance,
	onQuickJoin: () => void,
	setOptionsOpen: (open: boolean) => void,
) => [
	{
		label: "START GAME",
		action: () => {
			setOptionsOpen(true);
		},
	},
	{
		label: "Quick join",
		action: () => {
			onQuickJoin();
		},
	},
	{
		label: "Join Room",

		action: () => router.push("/searchRoom"),
	},
];
