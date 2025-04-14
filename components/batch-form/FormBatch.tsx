"use client";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BatchSchema } from "@/lib/zod";
import { ProblemForm } from "@/components/batch-form/FormProblem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import * as z from "zod";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useTransition } from "react";

type FormBatchType = z.infer<typeof BatchSchema>;

export default function BatchForm({ onClose }: { onClose: () => void }) {
	const [isPending, setTransition] = useTransition();
	const methods = useForm<FormBatchType>({
		resolver: zodResolver(BatchSchema),
		defaultValues: {
			title: "",
			description: "",
			publish: false,
			timer: "60",
			startedAt: new Date().toISOString().slice(0, 16),
			problems: [],
		},
	});

	const {
		handleSubmit,
		control,
		register,
		formState: { errors },
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "problems",
	});

	const onSubmit = async (data: FormBatchType) => {
		setTransition(async () => {
			const res = await fetch("/api/batch", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await res.json();

			if (!res.ok) {
				toast.error(result.message);
			} else {
				toast.success(result.message);
			}
			onClose();
		});
	};

	const getEmptyProblem = () => ({
		title: "",
		description: "",
		functionExecution: "",
		languages: [
			{ name: "Javascript", functionTemplate: "", languageId: 15 },
			{ name: "Python", functionTemplate: "", languageId: 19 },
			{ name: "Ruby", functionTemplate: "", languageId: 22 },
			{ name: "C++", functionTemplate: "", languageId: 11 },
			{ name: "C", functionTemplate: "", languageId: 6 },
			{ name: "Java", functionTemplate: "", languageId: 14 },
			{ name: "Rust", functionTemplate: "", languageId: 23 },
		],
		testCases: [],
	});

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="max-w-3xl mx-auto bg-white border relative border-neutral-200 rounded-lg p-8 shadow-sm"
			>
				<h2 className="text-2xl font-bold text-neutral-800 mb-6 text-center">
					Create Coding Batch
				</h2>

				<Button
					onClick={onClose}
					variant="ghost"
					size="icon"
					className="absolute top-3 right-3 h-10 w-10 cursor-pointer"
				>
					<X size={18} />
				</Button>

				{/* Batch Title */}
				<div className="mb-4">
					<label
						htmlFor="batch-title"
						className="block text-sm font-medium text-neutral-600 mb-2"
					>
						Batch Title
					</label>
					<Input
						disabled={isPending}
						id="batch-title"
						{...register("title")}
						placeholder="Enter batch title"
						className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500"
					/>
					{errors.title && (
						<p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
					)}
				</div>

				{/* Batch Description */}
				<div className="mb-4">
					<label
						htmlFor="batch-description"
						className="block text-sm font-medium text-neutral-600 mb-2"
					>
						Batch Description
					</label>
					<Input
						disabled={isPending}
						id="batch-description"
						{...register("description")}
						placeholder="Enter batch description"
						className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500"
					/>
					{errors.description && (
						<p className="text-red-500 text-xs mt-1">
							{errors.description.message}
						</p>
					)}
				</div>

				{/* Publish */}
				<div className="mb-4 flex items-center justify-between">
					<label
						htmlFor="batch-publish"
						className="text-sm font-medium text-neutral-600"
					>
						Publish
					</label>
					<Switch
						disabled={isPending}
						id="batch-publish"
						{...register("publish")}
						onCheckedChange={(value) => methods.setValue("publish", value)}
					/>
				</div>

				{/* Timer */}
				<div className="mb-4">
					<label
						htmlFor="batch-timer"
						className="block text-sm font-medium text-neutral-600 mb-2"
					>
						Timer (minutes)
					</label>
					<Input
						disabled={isPending}
						id="batch-timer"
						type="number"
						{...register("timer")}
						placeholder="Enter timer duration"
						className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500"
					/>
					{errors.timer && (
						<p className="text-red-500 text-xs mt-1">{errors.timer.message}</p>
					)}
				</div>

				{/* Started At */}
				<div className="mb-4">
					<label
						htmlFor="batch-startedAt"
						className="block text-sm font-medium text-neutral-600 mb-2"
					>
						Start Time
					</label>
					<Input
						disabled={isPending}
						id="batch-startedAt"
						type="datetime-local"
						{...register("startedAt")}
						className="bg-white border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500"
					/>
					{errors.startedAt && (
						<p className="text-red-500 text-xs mt-1">
							{errors.startedAt.message}
						</p>
					)}
				</div>

				{/* Problems Section */}
				<div className="mt-6">
					<h3 className="text-lg font-semibold text-neutral-800 mb-4">
						Problems
					</h3>
					{fields.map((field, index) => (
						<div
							key={field.id}
							className="mb-4 border border-neutral-200 rounded-lg"
						>
							<ProblemForm nestIndex={index} />
							<div className="p-4 border-t border-neutral-200 flex justify-end">
								<Button
									disabled={isPending}
									type="button"
									onClick={() => remove(index)}
									variant="outline"
									className="text-red-600 hover:bg-red-50"
								>
									<Trash size={16} className="mr-2" /> Remove Problem
								</Button>
							</div>
						</div>
					))}

					<div className="flex gap-4 flex-col">
						<Button
							disabled={isPending}
							type="button"
							onClick={() => append(getEmptyProblem())}
							variant="outline"
							className="text-neutral-600 w-fit hover:bg-neutral-100"
						>
							<Plus size={16} className="mr-2" /> Add Problem
						</Button>
						{errors.problems && (
							<p className="text-red-500 text-xs mt-1">
								{errors.problems?.message}
							</p>
						)}

						<Button
							disabled={isPending}
							type="submit"
							className="bg-neutral-800 hover:bg-neutral-700 text-white"
						>
							Submit Batch
						</Button>
					</div>
				</div>
			</form>
		</FormProvider>
	);
}
