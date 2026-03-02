import { beforeEach, describe, expect, it } from "vitest";
import type { Player } from "@/lib/type";
import { useGameStore } from "@/store/game_store";

const makePlayer = (overrides: Partial<Player> = {}): Player => ({
	id: "p1",
	socketid: "s1",
	username: "Alice",
	rank: 1,
	position: 0,
	votes: 0,
	money: 1500,
	color: "#ff0000",
	properties: [],
	leader: false,
	...overrides,
});

describe("useGameStore", () => {
	beforeEach(() => {
		useGameStore.setState({
			players: [],
			username: "",
			userId: "",
			turn: 1,
			color: "",
			votedPlayers: [],
			trade: [],
			timerSeconds: 0,
		});
	});

	describe("setPlayers + getPlayerCount", () => {
		it("sets players and returns count", () => {
			const players = [makePlayer(), makePlayer({ id: "p2", username: "Bob" })];
			useGameStore.getState().setPlayers(players);
			expect(useGameStore.getState().getPlayerCount()).toBe(2);
		});
	});

	describe("addProperty", () => {
		it("adds property to correct player", () => {
			useGameStore.getState().setPlayers([makePlayer()]);
			useGameStore.getState().addProperty("p1", 1);
			const props = useGameStore.getState().getProperty("p1");
			expect(props).toHaveLength(1);
			expect(props[0]?.id).toBe(1);
		});

		it("removes property from previous owner on trade", () => {
			useGameStore.getState().setPlayers([
				makePlayer({
					id: "p1",
					properties: [{ id: 1, rank: 0, group: 1 }],
				}),
				makePlayer({ id: "p2", username: "Bob" }),
			]);
			// Transfer property 1 from p1 to p2
			useGameStore.getState().addProperty("p2", 1);
			expect(useGameStore.getState().getProperty("p1")).toHaveLength(0);
			expect(useGameStore.getState().getProperty("p2")).toHaveLength(1);
		});
	});

	describe("removeProperty", () => {
		it("removes property from player", () => {
			useGameStore.getState().setPlayers([
				makePlayer({
					properties: [{ id: 5, rank: 0, group: 2 }],
				}),
			]);
			useGameStore.getState().removeProperty("p1", 5);
			expect(useGameStore.getState().getProperty("p1")).toHaveLength(0);
		});
	});

	describe("getProperty", () => {
		it("returns empty array for unknown player", () => {
			expect(useGameStore.getState().getProperty("unknown")).toEqual([]);
		});

		it("returns player properties", () => {
			useGameStore.getState().setPlayers([
				makePlayer({
					properties: [
						{ id: 1, rank: 0, group: 1 },
						{ id: 2, rank: 1, group: 1 },
					],
				}),
			]);
			expect(useGameStore.getState().getProperty("p1")).toHaveLength(2);
		});
	});

	describe("getRankOfProperty", () => {
		it("returns rank of owned property", () => {
			useGameStore.getState().setPlayers([
				makePlayer({
					properties: [{ id: 3, rank: 2, group: 1 }],
				}),
			]);
			expect(useGameStore.getState().getRankOfProperty(3)).toBe(2);
		});

		it("returns 0 if property not found", () => {
			useGameStore.getState().setPlayers([makePlayer()]);
			expect(useGameStore.getState().getRankOfProperty(99)).toBe(0);
		});
	});

	describe("checkPropertyIsOwned", () => {
		it("returns true when property is owned", () => {
			useGameStore.getState().setPlayers([
				makePlayer({
					properties: [{ id: 1, rank: 0, group: 1 }],
				}),
			]);
			expect(useGameStore.getState().checkPropertyIsOwned(1)).toBe(true);
		});

		it("returns false when property is not owned", () => {
			useGameStore.getState().setPlayers([makePlayer()]);
			expect(useGameStore.getState().checkPropertyIsOwned(1)).toBe(false);
		});
	});

	describe("checkPropertyOwnedByPlayer", () => {
		it("returns true for owner", () => {
			useGameStore.getState().setPlayers([
				makePlayer({
					properties: [{ id: 1, rank: 0, group: 1 }],
				}),
			]);
			expect(useGameStore.getState().checkPropertyOwnedByPlayer("p1", 1)).toBe(
				true,
			);
		});

		it("returns false for non-owner", () => {
			useGameStore
				.getState()
				.setPlayers([makePlayer(), makePlayer({ id: "p2", username: "Bob" })]);
			expect(useGameStore.getState().checkPropertyOwnedByPlayer("p2", 1)).toBe(
				false,
			);
		});
	});

	describe("getPlayersMoney", () => {
		it("returns money for known player", () => {
			useGameStore.getState().setPlayers([makePlayer({ money: 2000 })]);
			expect(useGameStore.getState().getPlayersMoney("p1")).toBe(2000);
		});

		it("returns 0 for unknown player", () => {
			expect(useGameStore.getState().getPlayersMoney("unknown")).toBe(0);
		});
	});

	describe("isThisPlayerLeader", () => {
		it("returns true when userId has min rank", () => {
			useGameStore.setState({ userId: "p1" });
			useGameStore
				.getState()
				.setPlayers([
					makePlayer({ rank: 1 }),
					makePlayer({ id: "p2", rank: 2 }),
				]);
			expect(useGameStore.getState().isThisPlayerLeader()).toBe(true);
		});

		it("returns false when another player has min rank", () => {
			useGameStore.setState({ userId: "p2" });
			useGameStore
				.getState()
				.setPlayers([
					makePlayer({ rank: 1 }),
					makePlayer({ id: "p2", rank: 2 }),
				]);
			expect(useGameStore.getState().isThisPlayerLeader()).toBe(false);
		});
	});

	describe("updatePlayer", () => {
		it("merges partial updates", () => {
			useGameStore.getState().setPlayers([makePlayer({ money: 1500 })]);
			useGameStore.getState().updatePlayer("p1", { money: 999 });
			expect(useGameStore.getState().getPlayersMoney("p1")).toBe(999);
			// Other fields should remain
			expect(
				useGameStore.getState().players.find((p) => p.id === "p1")?.username,
			).toBe("Alice");
		});
	});

	describe("getPropertyGroupById", () => {
		it("returns group from TileDataJson", () => {
			// Paris (id=1) is in group 1
			expect(useGameStore.getState().getPropertyGroupById(1)).toBe(1);
		});

		it("returns -1 for unknown tile", () => {
			expect(useGameStore.getState().getPropertyGroupById(999)).toBe(-1);
		});
	});

	describe("checkIfPropertyGroupIsOwnedByPlayer", () => {
		it("returns true when all group properties owned", () => {
			// Group 1 = Paris(1), Lyon(2), Marseille(3)
			useGameStore.getState().setPlayers([
				makePlayer({
					properties: [
						{ id: 1, rank: 0, group: 1 },
						{ id: 2, rank: 0, group: 1 },
						{ id: 3, rank: 0, group: 1 },
					],
				}),
			]);
			expect(
				useGameStore.getState().checkIfPropertyGroupIsOwnedByPlayer("p1", 1),
			).toBe(true);
		});

		it("returns false when group is partially owned", () => {
			useGameStore.getState().setPlayers([
				makePlayer({
					properties: [{ id: 1, rank: 0, group: 1 }],
				}),
			]);
			expect(
				useGameStore.getState().checkIfPropertyGroupIsOwnedByPlayer("p1", 1),
			).toBe(false);
		});
	});

	describe("getUsernameById", () => {
		it("returns name for known player", () => {
			useGameStore.getState().setPlayers([makePlayer()]);
			expect(useGameStore.getState().getUsernameById("p1")).toBe("Alice");
		});

		it("returns undefined for unknown player", () => {
			expect(
				useGameStore.getState().getUsernameById("unknown"),
			).toBeUndefined();
		});
	});

	describe("getColorOfUser", () => {
		it("returns color for known player", () => {
			useGameStore.getState().setPlayers([makePlayer({ color: "#00ff00" })]);
			expect(useGameStore.getState().getColorOfUser("p1")).toBe("#00ff00");
		});

		it("returns undefined for unknown player", () => {
			expect(useGameStore.getState().getColorOfUser("unknown")).toBeUndefined();
		});
	});

	describe("getColorByPropertyIndex", () => {
		it("returns owner color", () => {
			useGameStore.getState().setPlayers([
				makePlayer({
					color: "#abcdef",
					properties: [{ id: 1, rank: 0, group: 1 }],
				}),
			]);
			expect(useGameStore.getState().getColorByPropertyIndex(1)).toBe(
				"#abcdef",
			);
		});

		it("returns undefined when no owner", () => {
			useGameStore.getState().setPlayers([makePlayer()]);
			expect(
				useGameStore.getState().getColorByPropertyIndex(99),
			).toBeUndefined();
		});
	});

	describe("totalPropertyInGroup", () => {
		it("returns count of properties in group", () => {
			// Group 1 has Paris, Lyon, Marseille = 3 properties
			expect(useGameStore.getState().totalPropertyInGroup(1)).toBe(3);
		});
	});
});
