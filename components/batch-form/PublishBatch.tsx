"use client";

import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowUpDown, Search, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FormUpdateBatch from "./FormUpdateBatch";
import { Batch, BatchTeam, Problem, Team } from "@/lib/types";

const PublishBatch = ({ batchId }: { batchId: string }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [batch, setBatch] = useState<Batch>();
	const [allTeam, setAllTeam] = useState<Team[]>([]);
	const [assignedTeams, setAssignedTeams] = useState<string[]>([]);
	const [filterType, setFilterType] = useState<
		"all" | "assigned" | "unassigned" | "qualified"
	>("all");
	const [searchTerm, setSearchTerm] = useState<string>("");
	const router = useRouter();
	const [stepBatchEdit, setStepBatchEdit] = useState(false);

	// Fetch data logic
	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch(`/api/batch/${batchId}/publish`);

				if (!res.ok) {
					throw new Error("Failed to fetch data");
				}

				const { assignedBatch, teams, batch } = await res.json();

				setBatch(batch);

				setAllTeam(teams || []);

				// Set initially assigned users
				const initialAssignedUsers =
					assignedBatch?.map((bt: BatchTeam) => bt?.team?.id) || [];

				setAssignedTeams(initialAssignedUsers);

				setIsLoading(false);
			} catch (error) {
				toast.error("Failed to load batch data");
				console.error(error);
				setIsLoading(false);
			}
		}

		if (batchId) {
			fetchData();
		}
	}, [batchId]);

	// Handle user assignment toggle
	const handleTeamAssignmentToggle = (teamId: string) => {
		setAssignedTeams((prev) =>
			prev.includes(teamId)
				? prev.filter((id) => id !== teamId)
				: [...prev, teamId]
		);
	};

	// Handle select all users
	const handleSelectAll = () => {
		if (assignedTeams.length === filteredTeams.length) {
			setAssignedTeams([]);
		} else {
			setAssignedTeams(filteredTeams.map((u) => u.id));
		}
	};

	// Handle update batch assignment
	const handlePublishBatch = async () => {
		try {
			const res = await fetch(`/api/batch/${batchId}/publish`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					teamsId: assignedTeams,
				}),
			});

			if (!res.ok) {
				throw new Error("Failed to update batch assignment");
			}

			toast.success("Batch assignment updated successfully");
		} catch (error) {
			toast.error("Failed to update batch assignment");
			console.error(error);
		}
	};

	// Filter and sort users
	const filteredTeams = allTeam.filter(
		(team) =>
			(filterType === "all" ||
				(filterType === "assigned" && assignedTeams.includes(team.id)) ||
				(filterType === "unassigned" && !assignedTeams.includes(team.id)) ||
				(filterType === "qualified" && !team.isDisqualified)) &&
			(searchTerm === "" ||
				team.name?.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3 font-poppins justify-center items-center min-h-screen">
				<RefreshCw className="animate-spin text-black" size={32} />
				<div>Loading Batch...</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			{stepBatchEdit && (
				<div className="inset-0 z-50 py-10 absolute min-h-screen max-h-fit bg-black/50">
					<FormUpdateBatch
						batchId={batch?.id || undefined}
						onClose={() => {
							setStepBatchEdit(false);
						}}
					/>
				</div>
			)}
			{/* Batch Details */}
			<div className="mb-6 relative">
				<div className="flex justify-between items-start">
					<div>
						<h2 className="text-2xl font-bold">{batch?.title}</h2>
						<p className="text-gray-600 mb-4">{batch?.description}</p>
						<p className="text-sm text-gray-500">
							Timer: {batch?.timer} minutes
						</p>
						<p className="text-sm text-gray-500">
							Publish: {batch?.publish ? "Yes" : "No"}
						</p>
						{/* Added Batch Assignment Summary */}
						<p className="text-sm text-gray-500 mt-2">
							Assigned Teams: {assignedTeams.length} / {allTeam.length}
						</p>
					</div>

					{/* Edit Batch Button */}
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							setStepBatchEdit(true);
						}}
					>
						<Edit className="h-4 w-4" />
					</Button>
				</div>

				{/* Problem Details Section */}
				<div className="bg-gray-100 p-4 rounded-lg mt-4">
					<h3 className="text-lg font-semibold mb-2">Problems in this Batch</h3>
					{batch?.problems && batch.problems.length > 0 ? (
						<ul className="space-y-2">
							{batch?.problems?.map((problem: Problem) => (
								<li key={problem.id} className="bg-white p-3 rounded shadow-sm">
									<div className="flex justify-between items-center">
										<span className="font-medium">{problem.title}</span>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500">No problems in this batch</p>
					)}
				</div>
			</div>

			{/* Users Section */}
			<div className="mb-4 flex flex-col space-x-4">
				<div className="flex flex-row mb-4">
					{/* Search Input */}
					<div className="relative flex-grow">
						<Input
							type="text"
							placeholder="Search by name"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							size={20}
						/>
					</div>

					{/* Filter Dropdown */}
					<Select
						value={filterType}
						onValueChange={(
							value: "all" | "assigned" | "unassigned" | "qualified"
						) => setFilterType(value)}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter Teams" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Teams</SelectItem>
							<SelectItem value="assigned">Assigned Teams</SelectItem>
							<SelectItem value="unassigned">Unassigned Teams</SelectItem>
							<SelectItem value="qualified">Qualified Teams</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Users Table */}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Checkbox
									checked={
										assignedTeams.length === filteredTeams.length &&
										filteredTeams.length > 0
									}
									onCheckedChange={handleSelectAll}
								/>
							</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Batch Assignment</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{filteredTeams.map((team) => (
							<TableRow
								key={team.id}
								onClick={() => router.push(`/account/${team.id}`)}
								className="cursor-pointer hover:bg-gray-100"
							>
								<TableCell>
									<Checkbox
										checked={assignedTeams.includes(team.id)}
										onCheckedChange={() => handleTeamAssignmentToggle(team.id)}
										onClick={(e) => e.stopPropagation()}
									/>
								</TableCell>
								<TableCell>{team.name || "No Name"}</TableCell>
								<TableCell>
									{team.isDisqualified ? "Disqualified" : "Qualified"}
								</TableCell>
								<TableCell>
									{assignedTeams.includes(team.id) ? (
										<span className="text-green-600 font-medium">Assigned</span>
									) : (
										<span className="text-gray-500">Not Assigned</span>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				{/* Show message if no users match search/filter */}
				{filteredTeams.length === 0 && (
					<div className="text-center text-gray-500 mt-4">No users found</div>
				)}

				{/* Update Assignment Button */}
				<div className="mt-4 flex justify-end">
					<button
						onClick={handlePublishBatch}
						className="bg-blue-500 text-white px-4 py-2 rounded 
            disabled:bg-gray-300 disabled:cursor-not-allowed"
					>
						Update Batch Assignment
					</button>
				</div>
			</div>
		</div>
	);
};

export default PublishBatch;
