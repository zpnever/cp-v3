"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Batch, Submission, Team } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";
import AlertDisqualified from "./ui/Alert-Disqualified";

const DisqualifiedTable = () => {
	const [batches, setBatches] = useState<Batch[]>([]);
	const [teams, setTeams] = useState([]);
	const [selectedBatch, setSelectedBatch] = useState("");
	const [submissions, setSubmissions] = useState<any>([]);
	const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
	const [sortConfig, setSortConfig] = useState({
		key: "teamName",
		direction: "ascending",
	});

	const getBatchesSubmissions = async () => {
		try {
			const res = await fetch(`/api/leaderboard`);
			const json = await res.json();

			if (!res.ok) {
				toast.error(json.message);
				return;
			}

			// Process the received data
			const batchData = json.data.submissionBatch || [];
			const teamData = json.data.team || [];
			setBatches(batchData);
			setTeams(teamData);

			if (batchData.length > 0) {
				setSelectedBatch(batchData[0].id);
				processSubmissions(batchData[0], teamData);
			}
		} catch (error) {
			toast.error("Failed to fetch leaderboard data");
			console.error(error);
		}
	};

	const getTeamName = (teamId: string, teamData: Team[]) => {
		const team = teamData.find((t) => t.id === teamId);
		return team ? team.name : `Unknown Team (${teamId.slice(0, 6)}...)`;
	};

	const processSubmissions = (batch: Batch, teamData: Team[]) => {
		if (!batch || !batch.submissions) return [];

		// Process submissions with real team names
		const processedSubmissions = batch.submissions.map((sub) => {
			// Calculate total execution time and memory
			let totalExecutionTime = 0;
			let totalMemory = 0;

			if (sub.submissionProblems && sub.submissionProblems.length > 0) {
				sub.submissionProblems.forEach((problem) => {
					totalExecutionTime += problem.executionTime || 0;
					totalMemory += problem.memory || 0;
				});
			}

			return {
				id: sub.id,
				teamId: sub.teamId,
				teamName: getTeamName(sub.teamId, teamData),
				score: sub.score || 0,
				problemsSolved: sub.totalProblemsSolved || 0,
				totalExecutionTime: totalExecutionTime.toFixed(3),
				totalMemory,
				completionTime: sub.completionTime,
			};
		});

		setSubmissions(processedSubmissions);
		return processedSubmissions;
	};

	const handleBatchChange = (batchId: string) => {
		setSelectedBatch(batchId);
		const selectedBatchData = batches.find((batch) => batch.id === batchId);
		if (selectedBatchData) {
			processSubmissions(selectedBatchData, teams);
		}
		// Reset selected teams when changing batches
		setSelectedTeamIds([]);
	};

	const requestSort = (key: string) => {
		let direction = "ascending";
		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	const getSortedItems = () => {
		const sortableItems = [...submissions];
		if (sortConfig.key) {
			sortableItems.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	};

	// Format completion time from seconds to human-readable format
	const formatCompletionTime = (seconds: number) => {
		if (!seconds) return "N/A";

		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		let result = "";
		if (hrs > 0) result += `${hrs}h `;
		if (mins > 0) result += `${mins}m `;
		result += `${secs}s`;

		return result.trim();
	};

	// Handle individual team selection
	const handleTeamSelection = (teamId: string, checked: boolean) => {
		if (checked) {
			setSelectedTeamIds((prev) => [...prev, teamId]);
		} else {
			setSelectedTeamIds((prev) => prev.filter((id) => id !== teamId));
		}
	};

	// Handle select all teams
	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			const allTeamIds = submissions.map(
				(submission: Submission) => submission.teamId
			);
			setSelectedTeamIds(allTeamIds);
		} else {
			setSelectedTeamIds([]);
		}
	};

	// Disqualify selected teams
	const handleDisqualifyTeams = async () => {};

	useEffect(() => {
		getBatchesSubmissions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getBatchName = (batchId: string) => {
		const batch = batches.find((b) => b.id === batchId);
		return batch
			? `${batch.title} (${new Date(batch.startedAt).toLocaleDateString()})`
			: "Unknown Batch";
	};

	return (
		<div className="space-y-4 container mx-auto px-4 py-6">
			<h2 className="text-2xl font-bold">Disqualified Team</h2>

			{/* Batch Selection */}
			<div className="flex items-center space-x-2">
				<span className="font-medium">Select Batch:</span>
				<Select value={selectedBatch} onValueChange={handleBatchChange}>
					<SelectTrigger className="w-[250px]">
						<SelectValue placeholder="Select a batch">
							{selectedBatch ? getBatchName(selectedBatch) : "Select a batch"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{batches.map((batch) => (
							<SelectItem key={batch.id} value={batch.id}>
								{batch.title} - {new Date(batch.startedAt).toLocaleString()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Leaderboard Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">Rank</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => requestSort("teamName")}
									className="flex items-center space-x-1"
								>
									Team
									<ArrowUpDown size={16} />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => requestSort("problemsSolved")}
									className="flex items-center space-x-1"
								>
									Problems Solved
									<ArrowUpDown size={16} />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => requestSort("score")}
									className="flex items-center space-x-1"
								>
									Score
									<ArrowUpDown size={16} />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => requestSort("totalExecutionTime")}
									className="flex items-center space-x-1"
								>
									Execution Time (s)
									<ArrowUpDown size={16} />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => requestSort("totalMemory")}
									className="flex items-center space-x-1"
								>
									Memory Usage (KB)
									<ArrowUpDown size={16} />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => requestSort("completionTime")}
									className="flex items-center space-x-1"
								>
									Completion Time
									<ArrowUpDown size={16} />
								</Button>
							</TableHead>
							<TableHead>
								<Checkbox
									checked={
										submissions.length > 0 &&
										selectedTeamIds.length === submissions.length
									}
									onCheckedChange={handleSelectAll}
									aria-label="Select all teams"
								/>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{getSortedItems().map((submission, index) => (
							<TableRow key={submission.id} className="hover:bg-gray-50">
								<TableCell>{index + 1}</TableCell>
								<TableCell className="font-medium">
									{submission.teamName}
								</TableCell>
								<TableCell>{submission.problemsSolved}</TableCell>
								<TableCell>{submission.score}</TableCell>
								<TableCell>{submission.totalExecutionTime}</TableCell>
								<TableCell>{submission.totalMemory}</TableCell>
								<TableCell>
									{formatCompletionTime(submission.completionTime)}
								</TableCell>
								<TableCell className="">
									<Checkbox
										checked={selectedTeamIds.includes(submission.teamId)}
										onCheckedChange={(checked) =>
											handleTeamSelection(submission.teamId, checked === true)
										}
										aria-label={`Select ${submission.teamName}`}
									/>
								</TableCell>
							</TableRow>
						))}
						{submissions.length === 0 && (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-4">
									No submissions available for this batch
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Disqualify Button */}
			<div className="flex justify-end">
				<AlertDisqualified teamIds={selectedTeamIds} />
			</div>
		</div>
	);
};

export default DisqualifiedTable;
