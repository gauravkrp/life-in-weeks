// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/generic/button";
import Footer from "@/components/ui/footer"; // Import the Footer component
import { Card } from "@/components/generic/card";
import { Input } from "@/components/generic/input";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Loader from "@/components/ui/loader";
import { ArrowBigRight } from "lucide-react";

// Register the scales and components needed for the bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TimeData {
	timeUnit: number;
	lived: boolean;
}

export default function Home() {
	const [birthDate, setBirthDate] = useState<string | null>(null);
	const [debouncedDOB, setDebouncedDOB] = useState<string | null>(null); // Debounced birth date state
	const [loading, setLoading] = useState(false); // Loading state

	const [lifespan, setLifespan] = useState<number>(90); // Default lifespan
	const [timeData, setTimeData] = useState<TimeData[]>([]);
	const [showVisualization, setShowVisualization] = useState<boolean>(false);
	const [viewMode, setViewMode] = useState<"grid" | "graph">("grid"); // Toggle between grid and graph view
	const [timeUnit, setTimeUnit] = useState<"weeks" | "months" | "years">("weeks"); // Default visualization by weeks
	const [showLifespanInput, setShowLifespanInput] = useState<boolean>(false); // Toggle to show/hide lifespan input

	/* const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (birthDate && lifespan > 0) {
			setShowVisualization(true);
		}
	}; */

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		setBirthDate(newDate);
		localStorage.setItem("gkp_chull_life_birthDate", newDate); // Save the new date to localStorage
	};

	useEffect(() => {
		// Retrieve birth date from localStorage if available
		const storedDOB = localStorage.getItem("gkp_chull_life_birthDate");
		if (storedDOB) {
			setBirthDate(storedDOB);
		}
	}, []);

	// Debounce effect: Update debouncedDOB after 500ms delay
	useEffect(() => {
		if (birthDate) {
			setLoading(true); // Show loader while waiting
			const handler = setTimeout(() => {
				setDebouncedDOB(birthDate); // Set debounced value after 500ms
				localStorage.setItem("gkp_chull_life_birthDate", birthDate); // Save to localStorage
				setLoading(false); // Hide loader once debounce is done
			}, 500);

			return () => clearTimeout(handler); // Cleanup the timeout if the user keeps typing
		}
	}, [birthDate]);

	useEffect(() => {
		if (debouncedDOB && lifespan) {
			const birth = new Date(debouncedDOB);
			const today = new Date();
			const ageInDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)); // Age in days
			let totalUnits: number;
			let livedUnits: number;

			if (timeUnit === "weeks") {
				totalUnits = lifespan * 52;
				livedUnits = Math.floor(ageInDays / 7); // Weeks lived
			} else if (timeUnit === "months") {
				totalUnits = lifespan * 12;
				livedUnits = Math.floor(ageInDays / 30.44); // Months lived
			} else {
				totalUnits = lifespan;
				livedUnits = Math.floor(ageInDays / 365.25); // Years lived
			}

			const timeArray: TimeData[] = [];
			for (let i = 0; i < totalUnits; i++) {
				timeArray.push({
					timeUnit: i + 1,
					lived: i < livedUnits,
				});
			}
			setTimeData(timeArray);
			setShowVisualization(true); // Automatically show the visualization when date is valid
		}
	}, [debouncedDOB, lifespan, timeUnit]); // Update timeData when birthDate, lifespan, or timeUnit changes

	const renderGridView = () => {
		// Define the grid columns for weeks using an object for inline styles
		const weeksGridCols = { gridTemplateColumns: "repeat(52, minmax(0, 1fr))" }; // 52 columns for weeks

		// Use string for Tailwind classes for months/years
		const gridColsClass = timeUnit === "months" ? "grid-cols-12" : "grid-cols-10"; // Tailwind classes for months/years

		// Add a check to ensure timeData has been generated properly
		if (!timeData.length) return <p>Loading data...</p>;

		// Create an array for year labels, with 10-year increments
		const yearsArray = Array.from({ length: 10 }, (_, i) => i * 10);

		return (
			<div className="relative mt-6">
				{/* Arrow and Text for Weeks Increasing */}
				<div className="absolute -top-8 left-14 flex items-center space-x-2">
					<span className="text-sm font-medium">Weeks Increasing</span>
					<ArrowBigRight />
				</div>

				{/* Arrow and Text for Age Increasing */}
				<div className="absolute -left-10 top-12 flex items-center space-x-2 rotate-90">
					<span className="text-sm font-medium">Age Increasing</span>
					<ArrowBigRight />
				</div>

				{/* Main Grid with Year Labels on Left */}
				<div className="flex mt-8 ml-8">
					{/* Left-side year labels */}
					<div className="flex flex-col justify-between items-end mr-2 text-sm text-gray-700">
						{yearsArray.map((year, i) => (
							<span key={i}>{year}</span>
						))}
					</div>

					{/* The grid itself */}
					<div
						className={`grid gap-1 ${timeUnit === "weeks" ? "" : gridColsClass}`} // Use Tailwind for months/years
						style={timeUnit === "weeks" ? weeksGridCols : {}} // Apply inline style only for weeks
					>
						{timeData.map((unit, index) => (
							<div
								key={index}
								className={`${timeUnit === "weeks" ? "w-1 h-1 md:w-1.5 md:h-1.5" : "w-1.5 h-1.5 md:w-3 md:h-3"} ${
									unit.lived ? "bg-green-500" : "bg-gray-300"
								}`}
								title={`${timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)} ${unit.timeUnit}`}
							/>
						))}
					</div>
				</div>
			</div>
		);
	};

	const renderGraphView = () => {
		const lived = timeData.filter((unit) => unit.lived).length;
		const left = timeData.length - lived;

		const data = {
			labels: [
				`${timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)} Lived`,
				`${timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)} Left`,
			],
			datasets: [
				{
					label: `Life in ${timeUnit}`,
					data: [lived, left],
					backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
					borderWidth: 1,
				},
			],
		};

		return (
			<div className="mt-6">
				<Bar data={data} />
			</div>
		);
	};

	return (
		<div className="min-h-screen flex flex-col justify-between items-center bg-gray-100 p-4 md:p-8">
			<main className="flex-grow flex flex-col items-center justify-center w-full">
				<Card className="w-full max-w-2xl p-6 bg-white shadow-md rounded-md">
					<div className="text-center">
						<h1 className="text-2xl font-semibold inline-block">Your Life in </h1>
						<select
							className="text-2xl ml-0.5 text-red-500 font-semibold bg-transparent focus:border-indigo-600 focus:outline-none"
							value={timeUnit}
							onChange={(e) => setTimeUnit(e.target.value as "weeks" | "months" | "years")}
						>
							<option value="weeks">Weeks</option>
							<option value="months">Months</option>
							<option value="years">Years</option>
						</select>
					</div>

					{/* Form Section */}
					<div className="space-y-4 mt-4">
						<div className="flex items-center max-w-sm mx-auto">
							<label htmlFor="birthDate" className="flex-1 block text-sm font-medium text-gray-700">
								Your birth date:
							</label>
							<Input
								type="date"
								value={birthDate || ""}
								// onChange={(e) => setBirthDate(e.target.value)}
								id="birthDate"
								className="mt-1 w-full flex-1"
								required
								onChange={handleDateChange} // Call the handleDateChange function on change
							/>
						</div>

						{/* Default lifespan text and reveal button */}
						{!showLifespanInput && (
							<div className="flex justify-center space-x-1 items-center text-sm text-neutral-500 mt-0.5">
								<p>Default lifespan is 90 years.</p>
								<Button
									// variant="ghost"
									className="text-blue-500"
									onClick={() => setShowLifespanInput(true)}
									variant="link"
								>
									Change
								</Button>
							</div>
						)}

						{/* Lifespan input field, only shown when user clicks "Change" */}
						{showLifespanInput && (
							<div className="mt-2">
								<label htmlFor="lifespan" className="block text-sm font-medium text-gray-700">
									Enter your expected lifespan (in years):
								</label>
								<Input
									type="number"
									value={lifespan}
									onChange={(e) => setLifespan(parseInt(e.target.value))}
									id="lifespan"
									className="mt-1 w-full"
									min="1"
									required
								/>
							</div>
						)}

						{/* <Button type="submit" className="w-full mt-4">
								Submit
							</Button> */}
					</div>

					{/* Show SVG Loader when loading */}
					{loading ? (
						<div className="flex justify-center items-center mt-4">
							<Loader />
						</div>
					) : (
						<>
							{/* Visualization Section */}
							{showVisualization && (
								<>
									<div className="flex justify-center mt-4">
										<Button onClick={() => setViewMode(viewMode === "grid" ? "graph" : "grid")}>
											Switch to {viewMode === "grid" ? "Graph View" : "Grid View"}
										</Button>
									</div>
									{viewMode === "grid" ? renderGridView() : renderGraphView()}
									<div className="mt-6 flex items-center sticky bottom-6 justify-center">
										<div className="flex items-center justify-center space-x-1 text-sm text-center text-neutral-600 p-4 bg-white shadow-md rounded-md">
											<h2 className="text-sm font-medium">
												Total {timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)} Lived:{" "}
												<span className="font-semibold">{timeData.filter((unit) => unit.lived).length}.</span>
											</h2>
											<h2 className="text-sm font-medium">
												Total {timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)} Left:{" "}
												<span className="font-semibold">{timeData.filter((unit) => !unit.lived).length}.</span>
											</h2>
										</div>
									</div>
								</>
							)}
						</>
					)}
				</Card>
			</main>

			<Footer />
		</div>
	);
}
