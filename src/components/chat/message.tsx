export default function Message({
	name,
	message,
}: {
	name: string;
	message: string;
}) {
	return (
		<div>
			{name}: {message}
		</div>
	);
}
