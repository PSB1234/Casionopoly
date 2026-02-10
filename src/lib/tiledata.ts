import type { TileDataSchema } from "@/lib/type";

const createProperty = (
	name: string,
	flagName: string,
	group: number,
	price: number,
	buyable: boolean = true,
	isCornerTile: boolean = false,
	rent: number[],
): Partial<TileDataSchema> => ({
	name,
	flagName,
	group,
	type: "property",
	price,
	rent,
	buyable,
	reward: 0,
	isCornerTile,
	upgrade: [50, 100, 200, 300, 400, 500]
});

const createTile = (
	name: string,
	type: TileDataSchema["type"],
	isCornerTile: boolean,
	reward: number = 0,
): Partial<TileDataSchema> => ({
	name,
	type,
	isCornerTile,
	buyable: false,
	reward,
});
//32 tiles in total
const TileDataJsonPartial: Partial<TileDataSchema>[] = [
	{
		...createTile("Start", "start", true, 200),
	},
	{
		...createProperty("Paris", "France", 1, 120, true, false, [100, 140, 230, 390, 460, 500]),
	},
	{
		...createProperty("Lyon", "France", 1, 100, true, false, [80, 120, 200, 300, 350, 400]),
	},
	{
		...createProperty("Marseille", "France", 1, 100, true, false, [80, 120, 200, 300, 350, 400]),
	},
	{
		...createTile("Port", "railroad", false),
	},
	{
		...createProperty(
			"Cairo", "Egypt",
			2, 140,
			true,
			false,
			[110, 160, 240, 410, 450, 500],
		),
	},
	{
		...createProperty(
			"Giza", "Egypt",
			2, 160,
			true,
			false,
			[120, 180, 260, 430, 480, 550],
		),
	},
	{
		...createProperty("Shanghai", "china-v", 3, 160, true, false, [120, 180, 260, 430, 480, 550]),
	},
	{
		...createTile("Jail", "jail", true),
	},
	{
		...createProperty(
			"Beijing",
			"China-r", 3,
			180,
			true,
			false,
			[140, 200, 280, 450, 500, 600],
		),
	},
	{
		...createProperty(
			"Osaka",
			"Japan", 4,
			180,
			true,
			false,
			[140, 200, 280, 450, 500, 600],
		),
	},
	{
		...createTile("Chest", "chance", false),
	},
	{
		...createProperty(
			"Tokyo",
			"Japan", 4,
			200,
			true,
			false,
			[160, 220, 300, 470, 520, 650],
		),
	},
	{
		...createProperty(
			"brisbane",
			"aus", 5,
			200,
			true,
			false,
			[160, 220, 300, 470, 520, 650],
		),
	},
	{
		...createTile("Railway", "railroad", false),
	},
	{
		...createProperty(
			"Sydney",
			"aus", 5,
			220,
			true,
			false,
			[180, 240, 320, 490, 540, 700],
		),
	},
	{
		...createTile("Vacation", "Vacation", true),
	},
	{
		...createProperty(
			"banglore",
			"india", 6,
			240,
			true,
			false,
			[200, 260, 340, 510, 560, 750],
		),
	},
	{
		...createProperty(
			"Delhi",
			"india", 6,
			240,
			true,
			false,
			[200, 260, 340, 510, 560, 750],
		),
	},
	{
		...createTile("Chest", "chance", false),
	},
	{
		...createTile("Caught", "go-to-jail", false),
	},
	{
		...createProperty(
			"mumbai",
			"india", 6,
			260,
			true,
			false,
			[220, 280, 360, 530, 580, 800],
		),
	},
	{
		...createProperty(
			"Dubai",
			"uae", 7,
			280,
			true,
			false,
			[240, 300, 380, 550, 600, 850],
		),
	},
	{
		...createProperty(
			"Sharjah",
			"uae", 7,
			280,
			true,
			false,
			[240, 300, 380, 550, 600, 850],
		),
	},
	{
		...createTile("Tax Department", "tax", true),
	},
	{
		...createProperty(
			"Hamburg",
			"germany", 8,
			300,
			true,
			false,
			[260, 320, 400, 570, 620, 900],
		),
	},
	{
		...createProperty(
			"Berlin",
			"germany", 8,
			300,
			true,
			false,
			[260, 320, 400, 570, 620, 900],
		),
	},
	{
		...createTile("airport", "railroad", false),
	},
	{
		...createProperty(
			"Ceara",
			"Brazil", 9,
			320,
			true,
			false,
			[280, 340, 420, 590, 640, 950],
		),
	},
	{
		...createProperty(
			"Sao Paulo",
			"Brazil", 9,
			320,
			true,
			false,
			[280, 340, 420, 590, 640, 950],
		),
	},
	{
		...createProperty(
			"New York",
			"usa", 10,
			350,
			true,
			false,
			[300, 360, 440, 610, 660, 1000],
		),
	},
	{
		...createProperty("Los Angeles", "usa", 10, 350, true, false, [300, 360, 440, 610, 660, 1000]),
	},
] as const;
const TileDataJson: TileDataSchema[] = TileDataJsonPartial.map((data, id) => {
	return { id, ...data } as TileDataSchema;
});

export const getNameOfPropertyById = (id: number): string => {
	const tile = TileDataJson.find((tile) => tile.id === id);
	return tile ? tile.name : "Unknown Property";
};
export default TileDataJson;
