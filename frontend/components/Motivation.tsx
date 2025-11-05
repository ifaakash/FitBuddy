"use client";

import { useEffect, useState } from "react";

const QUOTES = [
	"Small steps every day lead to big results.",
	"You don’t have to be extreme, just consistent.",
	"The body achieves what the mind believes.",
	"One workout at a time. One meal at a time.",
	"Discipline beats motivation.",
	"Stronger than yesterday.",
];

export default function Motivation() {
	const [quote, setQuote] = useState<string>("");

	useEffect(() => {
		const idx = Math.floor(Math.random() * QUOTES.length);
		setQuote(QUOTES[idx]);
	}, []);

	if (!quote) return null;

	return (
		<div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
			<div className="max-w-4xl mx-auto px-4 py-2 text-center text-sm text-gray-700">
				{quote}
			</div>
		</div>
	);
}
