import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Your Life in Weeks | Count Your Life",
	description: "Visualize Your Life in Weeks, Months, or Years: A Simple Life Planner",
	icons: {
		icon: "/favicon.ico", // Path to your favicon
		shortcut: "/favicon.ico",
		apple: "/icons/apple-touch-icon.png", // Optional apple touch icon
	},
	manifest: "/site.webmanifest", // Path to your manifest file
	openGraph: {
		title: "Your Life in Weeks | Count Your Life",
		description: "Visualize Your Life in Weeks, Months, or Years: A Simple Life Planner",
		url: "https://countyourlife.com", // Your app's URL
		siteName: "Your Life in Weeks",
		images: [
			{
				url: "/your-life-in-weeks.webp", // Path to your OG image
				width: 1200,
				height: 630,
				alt: "Your Life in Weeks",
			},
		],
		type: "website",
		locale: "en_US",
	},
};

export const viewport: Viewport = {
	themeColor: "#000000",
};
const isProduction = process.env.NODE_ENV === "production";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" /> {/* Path to your favicon */}
				{/* Google Analytics */}
				{isProduction && (
					<>
						<Script
							strategy="afterInteractive"
							src={`https://www.googletagmanager.com/gtag/js?id=G-DFK951FMDJ`} // Replace with your Google Analytics Tracking ID
						/>
						<Script id="google-analytics" strategy="afterInteractive">
							{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DFK951FMDJ'); // Replace with your Google Analytics Tracking ID
          `}
						</Script>
					</>
				)}
			</head>

			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
