"use client";

import BatchForm from "@/components/batch-form/FormBatch";
import { Button } from "@/components/ui/button";
import { FormBatchType } from "@/lib/zod";
import { BadgePlus, RefreshCw, Trash, Edit, Send, Copy } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FormUpdateBatch from "@/components/batch-form/FormUpdateBatch";
import Link from "next/link";
import { duplicateBatch } from "@/actions/duplicateBatch";
import AlertDeleteBatch from "./ui/Alert-Delete";

interface IBatch extends FormBatchType {
	id: string;
	createdAt: string;
}

const BatchManagement = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
	const [batch, setBatch] = useState<IBatch[]>([]);
	const [stepBatchEdit, setStepBatchEdit] = useState(false);
	const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	useEffect(() => {
		fetchBatches();
	}, []);

	const fetchBatches = () => {
		fetch(`/api/batch`)
			.then((res) => res.json())
			.then((json) => {
				setBatch(json.data || []);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Failed to fetch batches:", error);
				toast.error("Failed to load batches");
				setIsLoading(false);
			});
	};

	const handleEdit = (id: string) => {
		setSelectedBatchId(id);
		setStepBatchEdit(true);
	};

	const handlePublish = (id: string) => {
		router.push(`/admin/batch/${id}/publish/`);
	};

	const handleDuplicate = (id: string) => {
		startTransition(() => {
			duplicateBatch(id);
			router.refresh();
		});
	};

	if (isLoading) {
		return (
			<div className="flex justify-center flex-col gap-3 items-center min-h-screen">
				<RefreshCw className="animate-spin text-black" size={32} />
				<h1 className="font-poppins text-lg">Loading Batches...</h1>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Add Batch Modal */}
			{isAddBatchModalOpen && (
				<div className="inset-0 z-50 py-10 absolute min-h-screen max-h-fit bg-black/50 backdrop-blur-sm">
					<BatchForm onClose={() => setIsAddBatchModalOpen(false)} />
				</div>
			)}
			{/* Edit Batch Modal */}
			{stepBatchEdit && (
				<div className="inset-0 z-50 py-10 absolute min-h-screen max-h-fit bg-black/50 backdrop-blur-sm">
					<FormUpdateBatch
						batchId={selectedBatchId!}
						onClose={() => {
							setStepBatchEdit(false);
						}}
					/>
				</div>
			)}

			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Batch Management</h1>
				<Button
					title="Add New Batch"
					onClick={() => setIsAddBatchModalOpen(true)}
					className="flex items-center gap-2"
					disabled={pending}
				>
					<BadgePlus size={16} /> Add New Batch
				</Button>
			</div>

			{/* Batch List */}
			{batch.length === 0 ? (
				<div className="flex items-center justify-center bg-gray-50 rounded-lg p-12 border border-gray-200">
					<div className="text-center">
						<p className="text-gray-500 mb-4">No batches found</p>
						<Button variant="default">Create your first batch</Button>
					</div>
				</div>
			) : (
				<div className="space-y-3">
					{batch.map((data) => (
						<div
							key={data.id}
							className="border border-gray-200 rounded-lg bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm"
						>
							<div className="flex justify-between items-start gap-6">
								<div className="flex-1">
									<Link
										href={`/admin/batch/${data.id}`}
										className="text-xl font-medium text-gray-800 hover:text-blue-600 transition-colors"
									>
										{data.title}
									</Link>
									<p className="text-gray-600 text-sm mt-1 mb-4">
										{data.description}
									</p>

									{/* Problems List */}
									<div className="bg-gray-50 rounded-md p-3 border border-gray-100">
										<p className="text-sm font-medium mb-2 text-gray-700">
											Problems
										</p>
										{data.problems.length === 0 ? (
											<p className="text-sm text-gray-500 italic">
												No problems added
											</p>
										) : (
											<div className="space-y-1.5">
												{data.problems.map((prob, index) => (
													<div
														key={index}
														className="flex items-center text-sm text-gray-600"
													>
														<span className="text-gray-400 mr-1.5">•</span>
														{prob.title}
													</div>
												))}
											</div>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className="flex flex-col gap-2 min-w-32">
									<Button
										variant="ghost"
										size="sm"
										className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full"
										disabled={pending}
										onClick={() => handleEdit(data.id)}
									>
										<Edit size={15} className="mr-2" />
										Edit
									</Button>

									<Button
										variant="ghost"
										size="sm"
										className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full"
										disabled={pending}
										onClick={() => handlePublish(data.id)}
									>
										<Send size={15} className="mr-2" />
										Publish
									</Button>

									<Button
										variant="ghost"
										size="sm"
										className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full"
										disabled={pending}
										onClick={() => handleDuplicate(data.id)}
									>
										<Copy size={15} className="mr-2" />
										Duplicate
									</Button>

									<AlertDeleteBatch
										pending={pending}
										fetchBatches={fetchBatches}
										batchId={data.id}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default BatchManagement;
