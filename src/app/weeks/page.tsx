// app/weeks/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Card } from "@/components/generic/card";

interface WeekData {
	weekNumber: number;
	lived: boolean;
}

export default function WeeksPage() {
	const searchParams = useSearchParams();
	const birthDate = searchParams.get("birthDate");
	const [weeksData, setWeeksData] = useState<WeekData[]>([]);

	useEffect(() => {
		if (birthDate) {
			const totalWeeks = 90 * 52; // 90 years in weeks
			const birth = new Date(birthDate);
			const today = new Date();
			const ageInWeeks = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 7));
			const weeksArray: WeekData[] = [];

			for (let i = 0; i < totalWeeks; i++) {
				weeksArray.push({
					weekNumber: i + 1,
					lived: i < ageInWeeks,
				});
			}

			setWeeksData(weeksArray);
		}
	}, [birthDate]);

	if (!birthDate) {
		return <div>Loading...</div>;
	}

	const weeksLived = weeksData.filter((week) => week.lived).length;
	const weeksLeft = weeksData.length - weeksLived;

	const data = {
		labels: ["Weeks Lived", "Weeks Left"],
		datasets: [
			{
				label: "Life in Weeks",
				data: [weeksLived, weeksLeft],
				backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					precision: 0,
				},
			},
		},
	};

	return (
		<div className="min-h-screen flex flex-col items-center bg-gray-100">
			<Card className="w-full max-w-2xl p-6 bg-white shadow-md rounded-md">
				<h1 className="text-2xl font-semibold text-center mb-4">Your Life in Weeks</h1>
				<div className="w-full">
					<Bar data={data} options={options} />
				</div>
				<div className="mt-6 text-center">
					<h2 className="text-lg font-medium">Total Weeks Lived: {weeksLived}</h2>
					<h2 className="text-lg font-medium">Total Weeks Left: {weeksLeft}</h2>
				</div>
				{/* Lifespan information */}
				<p className="text-center text-sm text-neutral-500 mt-4">
					This chart assumes a lifespan of 90 years (4680 weeks).
				</p>
			</Card>
		</div>
	);
}
