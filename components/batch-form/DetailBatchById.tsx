"use client";

import { useEffect, useState } from "react";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import Image from "next/image";
import { Batch, Problem, Submission, User } from "@/lib/types";
import { Button } from "../ui/button";
import { RichTextRenderer } from "./ui/RichTextRenderer";

const DetailBatchById = ({ batchId }: { batchId: string }) => {
	const [batch, setBatch] = useState<Batch>();
	const [users, setUsers] = useState<User[]>([]);
	const [problems, setProblems] = useState<Problem[]>([]);
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");
	const [openProblemId, setOpenProblemId] = useState<string | null>(null);

	useEffect(() => {
		const getBatchData = async () => {
			try {
				const res = await fetch(`/api/batch/${batchId}`);
				const json = await res.json();

				if (!res.ok) {
					toast.error(json.message);
					throw new Error("Invalid get batch data");
				}

				setBatch(json.batch);
				setUsers(json.batchUser.users);
				setProblems(json.batch?.problems || []);
				setSubmissions(json.batch?.submissions || []);
				setIsLoading(false);
			} catch (error) {
				console.error(error);
				toast.error("Something went wrong!");
				setIsLoading(false);
			}
		};

		if (batchId) getBatchData();
	}, [batchId]);

	const formatDate = (dateString: Date | null) => {
		try {
			if (dateString === null) {
				return "Batch is unsubmitted";
			}
			return format(new Date(dateString), "PPP 'at' p");
		} catch (error) {
			if (dateString === null) {
				return "Batch is unsubmitted";
			}
			return dateString.toString();
		}
	};

	const handleToggleProblem = (problemId: string) => {
		setOpenProblemId(openProblemId === problemId ? null : problemId);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-64 p-6">
				<RefreshCw className="h-8 w-8 animate-spin text-gray-500 mb-4" />
				<h3 className="text-lg font-medium">Loading Batch Details...</h3>
			</div>
		);
	}

	if (!batch) {
		return (
			<div className="flex flex-col items-center justify-center min-h-64 p-6">
				<h3 className="text-xl font-medium text-gray-700">Batch not found</h3>
			</div>
		);
	}

	return (
		<div className="bg-white w-full min-h-screen">
			{/* Header */}
			<div className="bg-gray-800 p-6 text-white">
				<h1 className="text-2xl font-bold mb-2">{batch.title}</h1>
				<div className="flex flex-wrap gap-4 text-sm opacity-90">
					<div>Created: {formatDate(batch.createdAt)}</div>
					<div className="flex items-center">
						<span
							className={`h-2 w-2 rounded-full mr-2 ${
								batch.publish ? "bg-gray-300" : "bg-gray-400"
							}`}
						></span>
						{batch.publish ? "Published" : "Unpublished"}
					</div>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="border-b border-gray-200">
				<nav className="flex -mb-px">
					{["overview", "problems", "participants", "submissions"].map(
						(tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`capitalize py-4 px-6 font-medium border-b-2 transition-colors ${
									activeTab === tab
										? "border-gray-800 text-gray-800"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								{tab}
							</button>
						)
					)}
				</nav>
			</div>

			{/* Tab Content */}
			<div className="p-6">
				{activeTab === "overview" && (
					<div>
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-2">Description</h2>
							<p className="text-gray-700 whitespace-pre-line">
								{batch.description || "No description provided."}
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-gray-50 p-4 border border-gray-100">
								<h3 className="font-medium text-gray-500 mb-1">Time Limit</h3>
								<p className="text-lg font-semibold">{batch.timer} minutes</p>
							</div>
							<div className="bg-gray-50 p-4 border border-gray-100">
								<h3 className="font-medium text-gray-500 mb-1">Problems</h3>
								<p className="text-lg font-semibold">{problems.length}</p>
							</div>
							<div className="bg-gray-50 p-4 border border-gray-100">
								<h3 className="font-medium text-gray-500 mb-1">Participants</h3>
								<p className="text-lg font-semibold">{users.length}</p>
							</div>
						</div>
					</div>
				)}

				{activeTab === "problems" && (
					<div>
						<h2 className="text-xl font-semibold mb-4">Problems</h2>
						{problems.length === 0 ? (
							<p className="text-gray-500 italic">
								No problems have been added to this batch.
							</p>
						) : (
							<div className="space-y-4">
								{problems.map((problem, index) => (
									<div
										key={problem.id}
										className="border border-gray-200 transition-all"
									>
										<div
											className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
											onClick={() => handleToggleProblem(problem.id)}
										>
											<div>
												<h3 className="font-medium">
													{index + 1}. {problem.title}
												</h3>
												<div className="flex mt-2 gap-2">
													<span className="bg-gray-100 text-gray-800 text-xs px-2 py-1">
														{problem.testCases?.length || 0} Test Cases
													</span>
												</div>
											</div>
											<Button variant="ghost" className="p-2">
												{openProblemId === problem.id ? (
													<ChevronUp className="w-5 h-5 text-gray-600" />
												) : (
													<ChevronDown className="w-5 h-5 text-gray-600" />
												)}
											</Button>
										</div>

										{/* Problem Detail (Expandable Content) */}
										{openProblemId === problem.id && (
											<div className="p-4 pt-0 border-t border-gray-100 bg-gray-50">
												<div className="mt-4">
													<h4 className="text-sm font-medium text-gray-500 mb-2">
														Problem Description
													</h4>
													<div className="p-3 bg-white">
														<RichTextRenderer
															description={problem.description}
														/>
													</div>
												</div>

												{problem.languages && problem.languages.length > 0 && (
													<div className="mt-4">
														<h4 className="text-sm font-medium text-gray-500 mb-2">
															Supported Languages
														</h4>
														<div className="flex flex-wrap gap-2">
															{problem.languages.map((language) => (
																<span
																	key={language.id}
																	className="bg-gray-200 text-gray-700 text-xs px-2 py-1"
																>
																	{language.name}
																</span>
															))}
														</div>
													</div>
												)}

												{problem.testCases && problem.testCases.length > 0 && (
													<div className="mt-4">
														<h4 className="text-sm font-medium text-gray-500 mb-2">
															Test Cases
														</h4>
														<div className="space-y-2">
															{problem.testCases.slice(0, 2).map((testCase) => (
																<div
																	key={testCase.id}
																	className="border border-gray-200 p-3 bg-white"
																>
																	<div className="grid grid-cols-2 gap-4">
																		<div>
																			<p className="text-xs text-gray-500 mb-1">
																				Input:
																			</p>
																			<pre className="bg-gray-50 p-2 text-xs overflow-x-auto">
																				{testCase.input}
																			</pre>
																		</div>
																		<div>
																			<p className="text-xs text-gray-500 mb-1">
																				Expected Output:
																			</p>
																			<pre className="bg-gray-50 p-2 text-xs overflow-x-auto">
																				{testCase.output}
																			</pre>
																		</div>
																	</div>
																</div>
															))}
															{problem.testCases.length > 2 && (
																<p className="text-xs text-gray-500 italic">
																	+ {problem.testCases.length - 2} more test
																	cases
																</p>
															)}
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "participants" && (
					<div>
						<h2 className="text-xl font-semibold mb-4">Participants</h2>
						{users.length === 0 ? (
							<p className="text-gray-500 italic">
								No participants have been assigned to this batch.
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead>
										<tr>
											<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Name
											</th>
											<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Email
											</th>
											<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Joined
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{users.map((batchUser) => (
											<tr key={batchUser.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-3">
															{batchUser?.photo && (
																<Image
																	src={batchUser.photo}
																	alt={batchUser.name || "photo.png"}
																	width={32}
																	height={32}
																	className="h-full w-full object-cover"
																/>
															)}
														</div>
														<div className="font-medium">
															{batchUser.name || "No name"}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm">
													{batchUser.email}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`inline-flex px-2 py-1 text-xs ${
															batchUser.isDisqualified
																? "bg-gray-100 text-gray-800"
																: "bg-gray-100 text-gray-800"
														}`}
													>
														{batchUser.isDisqualified
															? "Disqualified"
															: "Active"}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{formatDate(batchUser.createdAt)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}

				{activeTab === "submissions" && (
					<div>
						<h2 className="text-xl font-semibold mb-4">Submissions</h2>
						{submissions.length === 0 ? (
							<p className="text-gray-500 italic">
								No submissions have been made for this batch.
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead>
										<tr>
											<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Participant
											</th>
											<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Score
											</th>
											<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Problems Solved
											</th>
											<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Submitted At
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{submissions.map((submission) => (
											<tr key={submission.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-3">
															{submission.user?.photo && (
																<Image
																	src={submission.user.photo}
																	alt={submission.user.name || "photo.png"}
																	width={32}
																	height={32}
																	className="h-full w-full object-cover"
																/>
															)}
														</div>
														<div className="font-medium">
															{submission.user?.name || "Unknown User"}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="font-semibold">
														{submission.score}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{submission.totalProblemsSolved} / {problems.length}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`inline-flex px-2 py-1 text-xs ${
															submission.isFinish
																? "bg-gray-100 text-gray-800"
																: "bg-gray-100 text-gray-800"
														}`}
													>
														{submission.isFinish ? "Completed" : "In Progress"}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{formatDate(submission.submittedAt)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default DetailBatchById;
