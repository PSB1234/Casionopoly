import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useGameStore } from "@/store/game_store";

// We test the Properties component by pre-setting the game store state
// and checking rendered output.

describe("Properties component", () => {
	beforeEach(() => {
		useGameStore.setState({
			players: [],
			username: "",
			userId: "test-user",
			turn: 1,
			color: "",
			votedPlayers: [],
			trade: [],
			timerSeconds: 0,
		});
	});

	it('shows "No properties Owned" when properties are empty', async () => {
		useGameStore.setState({
			players: [
				{
					id: "test-user",
					socketid: "s1",
					username: "Tester",
					rank: 1,
					position: 0,
					votes: 0,
					money: 1500,
					color: "#ff0000",
					properties: [],
					leader: false,
				},
			],
		});

		const { default: Properties } = await import("@/components/properties");
		render(<Properties roomKey="123456" />);
		expect(screen.getByText("No properties Owned")).toBeDefined();
	});

	it("shows property names when properties exist", async () => {
		useGameStore.setState({
			players: [
				{
					id: "test-user",
					socketid: "s1",
					username: "Tester",
					rank: 1,
					position: 0,
					votes: 0,
					money: 1500,
					color: "#ff0000",
					properties: [
						{ id: 1, rank: 0, group: 1 },
						{ id: 5, rank: 0, group: 2 },
					],
					leader: false,
				},
			],
		});

		const { default: Properties } = await import("@/components/properties");
		render(<Properties roomKey="123456" />);
		// Paris (id=1) and Cairo (id=5) should appear
		expect(screen.getByText("Paris")).toBeDefined();
		expect(screen.getByText("Cairo")).toBeDefined();
	});
});
