"use client";

import { useEffect, useMemo, useState } from "react";
import { getDailyNutrients } from "@/lib/api";

interface CalorieTrackerProps {
	date: string;
	refreshKey?: number;
}

export default function CalorieTracker({ date, refreshKey = 0 }: CalorieTrackerProps) {
	const [target, setTarget] = useState<number>(() => {
		if (typeof window === "undefined") return 2000;
		const saved = window.localStorage.getItem(`calorieTarget:${date}`);
		return saved ? Number(saved) : 2000;
	});
	const [consumed, setConsumed] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setLoading(true);
		getDailyNutrients(date)
			.then((data) => setConsumed(data.calories || 0))
			.finally(() => setLoading(false));
	}, [date, refreshKey]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(`calorieTarget:${date}`, String(target));
		}
	}, [date, target]);

    const isOver = consumed > target;
    const remainingRaw = target - consumed;
    const remaining = Math.max(remainingRaw, 0);
    const progress = Math.min(consumed / Math.max(target, 1), 1);

	// Circular progress dimensions
	const size = 140;
	const strokeWidth = 12;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const dashoffset = circumference * (1 - progress);

return (
		<div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center">
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Calorie Tracker</h3>
			<div className="flex items-center gap-6">
				<svg width={size} height={size} className="block">
					<circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
                <circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
                    stroke={isOver ? "#ef4444" : "#10b981"}
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={dashoffset}
						strokeLinecap="round"
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
					/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className={isOver ? "fill-red-600" : "fill-gray-800"} style={{ fontSize: 16, fontWeight: 600 }}>
                    {isOver ? Math.abs(Math.round(remainingRaw)) : Math.round(remaining)}
					</text>
					<text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" className="fill-gray-500" style={{ fontSize: 11 }}>
                    {isOver ? "over" : "remaining"}
					</text>
				</svg>
				<div>
					<p className="text-sm text-gray-600">Consumed</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {Math.round(consumed)}
                    {isOver && (
                        <span title="Over target" className="inline-flex items-center text-red-600">
                            ▲
                        </span>
                    )}
                </p>
					<p className="text-sm text-gray-600 mt-2">Target</p>
					<div className="flex items-center gap-2 mt-1">
						<input
							type="number"
							min={0}
							value={target}
							onChange={(e) => setTarget(Number(e.target.value))}
							className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
						/>
						<span className="text-gray-500">kcal</span>
					</div>
				</div>
			</div>
			{loading && <p className="text-xs text-gray-500 mt-3">Updating...</p>}
		</div>
	);
}
