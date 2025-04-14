import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import PopupDescriptionTag from "@/components/batch-form/ui/popup-description-tag";
import { RichTextRenderer } from "./RichTextRenderer";

// Rich Text Rendering Components
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

// Rich Text Input Component
export const RichTextInput = ({
	nestIndex,
	label = "Problem Description",
}: {
	nestIndex: number;
	label?: string;
}) => {
	const { register, setValue, watch } = useFormContext();
	const [isPreview, setIsPreview] = useState(false);

	// Watch the current description value
	const description = watch(`problems.${nestIndex}.description`);

	const handleRichTextSave = (content: string) => {
		// Save the raw text with rich text markers
		setValue(`problems.${nestIndex}.description`, content);
	};

	// Insert formatting tags at cursor position
	const insertTag = (tag: string, endTag: string) => {
		const textArea = document.getElementById(
			`problem-description-${nestIndex}`
		) as HTMLTextAreaElement;
		if (!textArea) return;

		const start = textArea.selectionStart;
		const end = textArea.selectionEnd;
		const selectedText = textArea.value.substring(start, end);
		const newText =
			textArea.value.substring(0, start) +
			tag +
			selectedText +
			endTag +
			textArea.value.substring(end);

		setValue(`problems.${nestIndex}.description`, newText);

		// Set focus back to textarea and position cursor after inserted text
		setTimeout(() => {
			textArea.focus();
			textArea.setSelectionRange(
				start + tag.length + selectedText.length + endTag.length,
				start + tag.length + selectedText.length + endTag.length
			);
		}, 0);
	};

	return (
		<div>
			<label
				htmlFor={`problem-description-${nestIndex}`}
				className="block text-sm font-medium text-neutral-600 mb-2"
			>
				{label}
			</label>

			<div className="mb-2 flex gap-2">
				<Button
					type="button"
					variant={!isPreview ? "default" : "outline"}
					onClick={() => setIsPreview(false)}
				>
					Edit
				</Button>
				<Button
					type="button"
					variant={isPreview ? "default" : "outline"}
					onClick={() => setIsPreview(true)}
				>
					Preview
				</Button>
				<PopupDescriptionTag />
			</div>

			{!isPreview ? (
				<div>
					<div className="flex flex-wrap gap-2 mb-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[h1]", "[/h1]")}
						>
							H1
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[h2]", "[/h2]")}
						>
							H2
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[h3]", "[/h3]")}
						>
							H3
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[h4]", "[/h4]")}
						>
							H4
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[b]", "[/b]")}
						>
							Bold
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[i]", "[/i]")}
						>
							Italic
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[code]", "[/code]")}
						>
							Code
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[block]\n", "\n[/block]")}
						>
							Block
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[br]", "")}
						>
							Line Break
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[space size=20]", "")}
						>
							Space
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => insertTag("[imageUpload src={}]", "")}
						>
							Image
						</Button>
					</div>
					<Textarea
						id={`problem-description-${nestIndex}`}
						{...register(`problems.${nestIndex}.description`)}
						placeholder="Write question here"
						className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500 min-h-[150px]"
						onChange={(e) => handleRichTextSave(e.target.value)}
					/>
				</div>
			) : (
				<div className="bg-white border border-neutral-300 p-3 rounded-md min-h-[150px]">
					<RichTextRenderer description={description} />
				</div>
			)}
		</div>
	);
};
