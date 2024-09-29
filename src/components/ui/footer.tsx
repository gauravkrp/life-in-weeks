// src/components/ui/Footer.tsx
import React from "react";
import { FaFire, FaHeart } from "react-icons/fa";

const Footer: React.FC = () => {
	return (
		<footer className="w-full text-center py-4">
			<p className="text-sm text-neutral-500">
				Based on the{" "}
				<a
					href="http://waitbutwhy.com/2014/05/life-weeks.html"
					target="_blank"
					rel="noopener noreferrer"
					className="underline hover:text-neutral-600"
				>
					Your Life in Weeks
				</a>{" "}
				post by{" "}
				<a
					href="https://x.com/waitbutwhy"
					target="_blank"
					rel="noopener noreferrer"
					className="underline hover:text-neutral-600"
				>
					Tim Urban
				</a>
				, from{" "}
				<a
					href="http://waitbutwhy.com/"
					target="_blank"
					rel="noopener noreferrer"
					className="underline hover:text-neutral-600"
				>
					Wait But Why
				</a>
				.
			</p>
			<p className="text-sm text-neutral-500 mt-0.5">
				Made with <FaFire className="inline text-red-600" title="Passion" />
				and <FaHeart className="inline text-red-600" /> by{" "}
				<a href="https://gauravkrp.com" className="underline" target="_blank" rel="noopener noreferrer">
					Gaurav
				</a>{" "}
				and{" "}
				<a href="https://chatgpt.com" className="underline" target="_blank" rel="noopener noreferrer">
					ChatGPT
				</a>
				.
			</p>
		</footer>
	);
};

export default Footer;
