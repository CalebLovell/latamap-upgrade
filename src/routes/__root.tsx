import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { lazy } from "react";

import appCss from "../styles.css?url";

const DevTools = lazy(() =>
	Promise.all([
		import("@tanstack/react-devtools"),
		import("@tanstack/react-router-devtools"),
	]).then(([{ TanStackDevtools }, { TanStackRouterDevtoolsPanel }]) => ({
		default: () => (
			<TanStackDevtools
				config={{ position: "bottom-right" }}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		),
	})),
);

export const Route = createRootRoute({
	notFoundComponent: () => <p>Page not found</p>,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Latin American Political History Map" },
			{
				name: "description",
				content: "A visual timeline of the political history of Latin America",
			},
			{ property: "og:title", content: "Latin American Political History Map" },
			{
				property: "og:description",
				content: "A visual timeline of the political history of Latin America",
			},
			{ property: "og:url", content: "https://latamap.com" },
			{
				property: "og:site_name",
				content: "Latin American Political History Map",
			},
			{ property: "og:type", content: "website" },
			{
				property: "og:image",
				content: "https://latamap.com/images/screenshot.png",
			},
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:type", content: "image/png" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:site", content: "@CalebLovell" },
			{
				name: "twitter:title",
				content: "Latin American Political History Map",
			},
			{
				name: "twitter:image",
				content: "https://latamap.com/images/screenshot.png",
			},
			{
				name: "twitter:description",
				content: "A visual timeline of the political history of Latin America",
			},
			{
				name: "twitter:image:alt",
				content: "A screenshot of the map set to January 1st, 2023",
			},
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
			{
				rel: "icon",
				href: "/favicon-16x16.png",
				type: "image/png",
				sizes: "16x16",
			},
			{
				rel: "icon",
				href: "/favicon-32x32.png",
				type: "image/png",
				sizes: "32x32",
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
				sizes: "180x180",
			},
			{ rel: "manifest", href: "/manifest.json" },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<div style={{ position: `absolute`, opacity: 0, zIndex: 10000000 }} />
				<script
					defer
					data-domain="latamap.com"
					src="https://plausible.io/js/script.tagged-events.js"
				/>
				{children}
				{import.meta.env.DEV && <DevTools />}
				<Scripts />
			</body>
		</html>
	);
}
