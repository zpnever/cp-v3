import React from "react";
import Image from "next/image";

const CodeBlock = ({ text }: { text: string }) => {
	return (
		<pre className="bg-black text-white font-mono p-4 rounded-md text-sm overflow-x-auto my-2">
			{text}
		</pre>
	);
};

const CodeInline = ({ text }: { text: string }) => {
	return (
		<code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded-sm font-mono text-sm">
			{text}
		</code>
	);
};

const RichTextImage = ({ url }: { url: string }) => {
	return (
		<div className="my-4 max-w-full overflow-hidden rounded-lg shadow-md">
			<Image
				src={url}
				alt="Problem Description Image"
				width={800}
				height={400}
				className="object-contain w-full h-auto"
				unoptimized
			/>
		</div>
	);
};

export const RichTextRenderer = ({ description }: { description: string }) => {
	if (!description) return null;

	const renderRichText = (text: string) => {
		const parts: React.ReactNode[] = [];
		let lastIndex = 0;

		// Regex for different tags
		const codeInlineRegex = /\[code\](.*?)\[\/code\]/g;
		const blockCodeRegex = /\[block\]([\s\S]*?)\[\/block\]/g;
		const imageUploadRegex = /\[imageUpload\s+src=\{(.*?)\}\]/g;
		const lineBreakRegex = /\[br\]/g;
		const spacingRegex = /\[space\s+size=(\d+)\]/g;
		// New heading tags
		const h1Regex = /\[h1\](.*?)\[\/h1\]/g;
		const h2Regex = /\[h2\](.*?)\[\/h2\]/g;
		const h3Regex = /\[h3\](.*?)\[\/h3\]/g;
		const h4Regex = /\[h4\](.*?)\[\/h4\]/g;
		// New formatting tags
		const boldRegex = /\[b\](.*?)\[\/b\]/g;
		const italicRegex = /\[i\](.*?)\[\/i\]/g;

		const combinedRegex = new RegExp(
			`(${codeInlineRegex.source}|${blockCodeRegex.source}|${imageUploadRegex.source}|${lineBreakRegex.source}|${spacingRegex.source}|${h1Regex.source}|${h2Regex.source}|${h3Regex.source}|${h4Regex.source}|${boldRegex.source}|${italicRegex.source})`,
			"g"
		);

		text.replace(combinedRegex, (match, ...args) => {
			const index = args[args.length - 2];

			// Add text before the match
			if (index > lastIndex) {
				parts.push(text.slice(lastIndex, index));
			}

			// Inline Code
			if (match.startsWith("[code]")) {
				const content = match.replace(/^\[code\]|\[\/code\]$/g, "");
				parts.push(<CodeInline key={`inline-${index}`} text={content} />);
			}
			// Block Code
			else if (match.startsWith("[block]")) {
				const content = match.replace(/^\[block\]|\[\/block\]$/g, "").trim();
				parts.push(<CodeBlock key={`block-${index}`} text={content} />);
			}
			// Image Upload
			else if (match.startsWith("[imageUpload")) {
				const urlMatch = match.match(/src=\{(.*?)\}/);
				if (urlMatch) {
					parts.push(
						<RichTextImage key={`image-${index}`} url={urlMatch[1]} />
					);
				}
			}
			// Line Break
			else if (match === "[br]") {
				parts.push(<br key={`br-${index}`} />);
			}
			// Spacing
			else if (match.startsWith("[space")) {
				const sizeMatch = match.match(/size=(\d+)/);
				if (sizeMatch) {
					const size = parseInt(sizeMatch[1], 10);
					parts.push(
						<div
							key={`space-${index}`}
							style={{ height: `${size}px` }}
							className="w-full"
						/>
					);
				}
			}
			// Heading 1
			else if (match.startsWith("[h1]")) {
				const content = match.replace(/^\[h1\]|\[\/h1\]$/g, "");
				parts.push(
					<h1 key={`h1-${index}`} className="text-3xl font-bold mt-6 mb-3">
						{content}
					</h1>
				);
			}
			// Heading 2
			else if (match.startsWith("[h2]")) {
				const content = match.replace(/^\[h2\]|\[\/h2\]$/g, "");
				parts.push(
					<h2 key={`h2-${index}`} className="text-2xl font-bold mt-5 mb-2">
						{content}
					</h2>
				);
			}
			// Heading 3
			else if (match.startsWith("[h3]")) {
				const content = match.replace(/^\[h3\]|\[\/h3\]$/g, "");
				parts.push(
					<h3 key={`h3-${index}`} className="text-xl font-semibold mt-4 mb-2">
						{content}
					</h3>
				);
			}
			// Heading 4
			else if (match.startsWith("[h4]")) {
				const content = match.replace(/^\[h4\]|\[\/h4\]$/g, "");
				parts.push(
					<h4 key={`h4-${index}`} className="text-lg font-semibold mt-3 mb-1">
						{content}
					</h4>
				);
			}
			// Bold text
			else if (match.startsWith("[b]")) {
				const content = match.replace(/^\[b\]|\[\/b\]$/g, "");
				parts.push(<strong key={`bold-${index}`}>{content}</strong>);
			}
			// Italic text
			else if (match.startsWith("[i]")) {
				const content = match.replace(/^\[i\]|\[\/i\]$/g, "");
				parts.push(<em key={`italic-${index}`}>{content}</em>);
			}

			lastIndex = index + match.length;
			return match;
		});

		// Add remaining text
		if (lastIndex < text.length) {
			parts.push(text.slice(lastIndex));
		}

		return parts;
	};

	return (
		<div className="rich-text-content prose prose-neutral whitespace-pre-wrap">
			{renderRichText(description)}
		</div>
	);
};
