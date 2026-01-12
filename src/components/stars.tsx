import { Star } from "lucide-react";

type RenderStarsOptions = {
	rating: number;
	total?: number;
	size?: number;
};

export function renderStars({
	rating,
	total = 5,
	size = 20,
}: RenderStarsOptions) {
	return Array.from({ length: total }, (_, i) => i).map((i) => (
		<Star
			key={`star-${i}`}
			size={size}
			className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-400"}
		/>
	));
}
