"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Code, FlaskConical, Plus, Trash } from "lucide-react";
import FormInputImage from "./FormInputImage";
import { useState } from "react";
import { RichTextInput } from "./ui/RichTextEditor";

const LANGUAGES = [
	{ name: "Javascript", label: "JavaScript", languageId: 63 },
	{ name: "Python", label: "Python", languageId: 71 },
	{ name: "Ruby", label: "Ruby", languageId: 72 },
	{ name: "C++", label: "C++", languageId: 52 },
	{ name: "C", label: "C", languageId: 50 },
	{ name: "Java", label: "Java", languageId: 62 },
	{ name: "Rust", label: "Rust", languageId: 73 },
];

export function ProblemForm({ nestIndex }: { nestIndex: number }) {
	const [popImage, setPopImage] = useState<boolean>(false);
	const { register, control } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: `problems.${nestIndex}.testCases`,
	});

	return (
		<>
			{/* Image Upload */}
			{popImage && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
					<FormInputImage onClose={() => setPopImage(false)} />
				</div>
			)}
			<div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-6 shadow-sm">
				<h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-neutral-800">
					<FileText size={20} className="text-neutral-600" /> Problem Details
				</h3>

				{/* Problem Title */}
				<div className="mb-4">
					<label
						htmlFor={`problem-title-${nestIndex}`}
						className="block text-sm font-medium text-neutral-600 mb-2"
					>
						Problem Title
					</label>
					<Input
						id={`problem-title-${nestIndex}`}
						{...register(`problems.${nestIndex}.title`)}
						placeholder="Enter problem title"
						className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500"
					/>
				</div>

				{/* Problem Description */}
				<div className="mb-4">
					<label
						htmlFor={`problem-description-${nestIndex}`}
						className="block text-sm font-medium text-neutral-600 mb-2"
					>
						Image Upload
					</label>

					<div className="mb-4 flex gap-1">
						<Button
							type="button"
							className="bg-white text-black hover:bg-gray-100 border-1"
							onClick={() => setPopImage(true)}
						>
							Upload Image
						</Button>
					</div>

					{/* Ini harusnya Rich Text */}
					<RichTextInput nestIndex={nestIndex} />
				</div>

				{/* Function Execution */}
				<div className="mb-4">
					<label
						htmlFor={`problem-function-execution-${nestIndex}`}
						className="block text-sm font-medium text-neutral-600 mb-2"
					>
						Function to Execute
					</label>
					<Input
						id={`problem-function-execution-${nestIndex}`}
						{...register(`problems.${nestIndex}.functionExecution`)}
						placeholder="Function name"
						className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500"
					/>
				</div>

				{/* Language Code Templates */}
				<div className="mb-4">
					<h4 className="text-lg font-medium flex items-center gap-2 text-neutral-800 mb-3">
						<Code size={20} className="text-neutral-600" /> Code Templates
					</h4>
					{LANGUAGES.map(({ name, label, languageId }, index) => (
						<div key={name} className="mb-3">
							<label
								htmlFor={`problem-${name}-functionTemplate-${nestIndex}`}
								className="block text-xs text-neutral-500 mb-1"
							>
								{label} Code Template
							</label>
							<Textarea
								id={`problem-${name}-functionTemplate-${nestIndex}`}
								{...register(
									`problems.${nestIndex}.languages.${index}.functionTemplate`
								)}
								placeholder={`${label} code template`}
								className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500"
							/>
							<Input
								className="hidden"
								{...register(`problems.${nestIndex}.languages.${index}.name`)}
								defaultValue={name}
							/>
							<Input
								className="hidden"
								{...register(
									`problems.${nestIndex}.languages.${index}.languageId`
								)}
								defaultValue={languageId}
							/>
						</div>
					))}
				</div>

				{/* Test Cases */}
				<div>
					<h4 className="text-lg font-medium flex items-center gap-2 text-neutral-800 mb-3">
						<FlaskConical size={20} className="text-neutral-600" /> Test Cases
					</h4>

					{fields.map((field, i) => (
						<div
							key={field.id}
							className="border border-neutral-200 rounded-lg p-4 mb-3 bg-white"
						>
							<div className="flex justify-between items-center mb-3">
								<h5 className="text-sm font-medium text-neutral-700">
									Test Case {i + 1}
								</h5>
								<Button
									type="button"
									onClick={() => remove(i)}
									variant="outline"
									size="sm"
									className="text-neutral-600 hover:bg-neutral-100"
								>
									<Trash size={14} />
								</Button>
							</div>

							<div className="mb-3">
								<label
									htmlFor={`problem-test-case-input-${nestIndex}-${i}`}
									className="block text-xs text-neutral-500 mb-1"
								>
									Input
								</label>
								<Input
									id={`problem-test-case-input-${nestIndex}-${i}`}
									{...register(`problems.${nestIndex}.testCases.${i}.input`)}
									placeholder="Input value"
									className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500"
								/>
							</div>
							<div>
								<label
									htmlFor={`problem-test-case-output-${nestIndex}-${i}`}
									className="block text-xs text-neutral-500 mb-1"
								>
									Expected Output
								</label>
								<Input
									id={`problem-test-case-output-${nestIndex}-${i}`}
									{...register(`problems.${nestIndex}.testCases.${i}.output`)}
									placeholder="Expected output"
									className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500"
								/>
							</div>
						</div>
					))}

					<Button
						type="button"
						onClick={() => append({})}
						variant="outline"
						className="w-full text-neutral-600 hover:bg-neutral-100"
					>
						<Plus size={16} className="mr-2" /> Add Test Case
					</Button>
				</div>
			</div>
		</>
	);
}
