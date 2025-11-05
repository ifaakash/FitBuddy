"use client";

import { useEffect, useMemo, useState } from "react";

interface TimePickerProps {
	value?: string;
	onChange: (value: string) => void;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

export default function TimePicker({ value, onChange }: TimePickerProps) {
	const initial = useMemo(() => {
		if (value && /^\d{2}:\d{2}$/.test(value)) {
			const [h, m] = value.split(":").map(Number);
			const am = h < 12;
			const hour12 = h % 12 === 0 ? 12 : h % 12;
			return { hour: hour12, minute: m, am };
		}
		const now = new Date();
		const h = now.getHours();
		const m = now.getMinutes();
		return { hour: ((h % 12) || 12), minute: m, am: h < 12 };
	}, [value]);

	const [hour, setHour] = useState<number>(initial.hour);
	const [minute, setMinute] = useState<number>(initial.minute - (initial.minute % 5));
	const [am, setAm] = useState<boolean>(initial.am);

	useEffect(() => {
		const h24 = (hour % 12) + (am ? 0 : 12);
		onChange(`${pad(h24)}:${pad(minute)}`);
	}, [hour, minute, am]);

	return (
		<div className="flex items-center gap-3">
			<select
				value={hour}
				onChange={(e) => setHour(Number(e.target.value))}
				className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
			>
				{Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
					<option key={h} value={h}>{h}</option>
				))}
			</select>
			:
			<select
				value={minute}
				onChange={(e) => setMinute(Number(e.target.value))}
				className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
			>
				{Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
					<option key={m} value={m}>{pad(m)}</option>
				))}
			</select>
			<div className="flex bg-gray-100 rounded-lg overflow-hidden">
				<button
					onClick={() => setAm(true)}
					className={`px-3 py-2 text-sm ${am ? "bg-white text-gray-900" : "text-gray-600"}`}
				>
					AM
				</button>
				<button
					onClick={() => setAm(false)}
					className={`px-3 py-2 text-sm ${!am ? "bg-white text-gray-900" : "text-gray-600"}`}
				>
					PM
				</button>
			</div>
		</div>
	);
}
