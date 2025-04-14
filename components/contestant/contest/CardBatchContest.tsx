"use client";

import { Batch, Submission } from "@/lib/types";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const CardBatchContest = ({ teamId }: { teamId: string }) => {
	const [batches, setBatches] = useState<any[]>([]);
	const [submission, setSubmission] = useState<Submission[]>([]);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const getTeamBatch = async () => {
			try {
				const res = await fetch(`/api/team-batch/${teamId}`);
				const json = await res.json();

				if (!res.ok) {
					toast.error(json.message);
					return;
				}

				setBatches(json.data.batches);
				setSubmission(json.data.submissions);
			} catch (error) {
				toast.error("Failed to fetch batch data");
			}
			setIsLoading(false);
		};

		getTeamBatch();

		// Update current time every second
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(interval);
	}, [teamId]);

	const handleStartBatch = async (batchId: string) => {
		console.log(batchId);
		console.log(submission);
		const submissionFiltered = submission.filter(
			(sub) => sub.batchId === batchId
		);
		const submissionId = submissionFiltered[0].id;

		router.push(`/contest/${submissionId}`);
	};

	const isStartTimeReached = (startTime: string) => {
		const startDate = new Date(startTime);
		return currentTime >= startDate;
	};

	const formatToIndonesianTime = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "dd MMMM yyyy, HH:mm", { locale: id });
	};

	const availableBatches = batches.filter((batchItem) => {
		const relatedSubmission = submission.find(
			(sub) => sub.batchId === batchItem.batchId
		);
		return relatedSubmission && !relatedSubmission.isFinish;
	});

	const historyBatches = batches.filter((batchItem) => {
		const relatedSubmission = submission.find(
			(sub) => sub.batchId === batchItem.batchId
		);
		return relatedSubmission && relatedSubmission.isFinish;
	});

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<RefreshCw className="h-8 w-8 animate-spin text-gray-500 mb-4" />
				<h3 className="text-lg font-medium">Loading...</h3>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-bold">Available Batches</h2>

				{availableBatches.length > 0 ? (
					<div className="grid grid-cols-1 pt-4 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{availableBatches.map((batchItem) => {
							const { batch, isStart } = batchItem;
							const canStart = isStartTimeReached(batch.startedAt) && !isStart;

							return (
								<div
									key={batch.id}
									className="p-4 border rounded-lg shadow-sm bg-white"
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="font-semibold text-lg">{batch.title}</h3>
										{batch.publish && (
											<span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
												Published
											</span>
										)}
									</div>

									<p className="text-sm text-gray-600 mb-2">
										{batch.description}
									</p>

									<div className="space-y-2 mb-4">
										<div className="flex items-start gap-2">
											<span className="text-gray-500 text-sm">Start Time:</span>
											<span className="text-sm font-medium">
												{formatToIndonesianTime(batch.startedAt)}
											</span>
										</div>

										<div className="flex items-start gap-2">
											<span className="text-gray-500 text-sm">Duration:</span>
											<span className="text-sm font-medium">
												{batch.timer} minutes
											</span>
										</div>
									</div>

									<button
										onClick={() => handleStartBatch(batch.id)}
										disabled={!canStart}
										className={`w-full py-2 px-4 rounded-md transition-colors ${
											isStart
												? "bg-gray-300 text-gray-600 cursor-not-allowed"
												: canStart
												? "bg-blue-600 text-white hover:bg-blue-700"
												: "bg-gray-300 text-gray-600 cursor-not-allowed"
										}`}
									>
										{isStart
											? "Started"
											: canStart
											? "Start Batch"
											: "Not Yet Available"}
									</button>
								</div>
							);
						})}
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">
						No available batches.
					</div>
				)}
			</div>

			{/* History Section */}
			<div>
				<h2 className="text-xl font-bold">History Batches</h2>

				{historyBatches.length > 0 ? (
					<div className="grid grid-cols-1 pt-4 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{historyBatches.map((batchItem) => {
							const { batch } = batchItem;

							return (
								<div
									key={batch.id}
									className="p-4 border rounded-lg shadow-sm bg-gray-100"
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="font-semibold text-lg">{batch.title}</h3>
										<span className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded-full">
											Finished
										</span>
									</div>
									<p className="text-sm text-gray-600 mb-2">
										{batch.description}
									</p>

									<div className="space-y-2">
										<div className="flex items-start gap-2">
											<span className="text-gray-500 text-sm">Start Time:</span>
											<span className="text-sm font-medium">
												{formatToIndonesianTime(batch.startedAt)}
											</span>
										</div>

										<div className="flex items-start gap-2">
											<span className="text-gray-500 text-sm">Duration:</span>
											<span className="text-sm font-medium">
												{batch.timer} minutes
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">
						No history found.
					</div>
				)}
			</div>
		</div>
	);
};

export default CardBatchContest;
