import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Message from "@/components/message";

describe("Message component", () => {
	it("renders player name", () => {
		render(<Message message="Hello" name="Alice" />);
		expect(screen.getByText(/Alice/)).toBeDefined();
	});

	it("renders message text", () => {
		render(<Message message="Good game!" name="Bob" />);
		expect(screen.getByText(/Good game!/)).toBeDefined();
	});
});
