"use client";

import { Team } from "@/lib/types";
import {
	ArrowUpDown,
	RefreshCw,
	Table as TableIcon,
	UserPlus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import CreateTeam from "./CreateTeam";
import { Button } from "../ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import PopupDelete from "../batch-form/ui/popup-delete";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const ShowTeam = () => {
	const [teams, setTeams] = useState<Team[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [stepCreateTeam, setStepCreateTeam] = useState(false);
	const [sortField, setSortField] = useState<"name" | "status">("name");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const fetchTeams = () => {
		setIsLoading(true);
		fetch("/api/teams")
			.then((res) => {
				if (!res.ok) {
					throw new Error("Failed to fetch teams");
				}
				return res.json();
			})
			.then((data) => {
				setTeams(data.teams || []);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching teams:", error);
				setIsLoading(false);
			});
	};

	useEffect(() => {
		fetchTeams();
	}, []);

	const handleSort = (field: "name" | "status") => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}

		const sortedTeams = [...teams].sort((a, b) => {
			if (field === "name") {
				return sortDirection === "asc"
					? a.name.localeCompare(b.name)
					: b.name.localeCompare(a.name);
			} else {
				const statusA = getTeamStatus(a);
				const statusB = getTeamStatus(b);
				return sortDirection === "asc"
					? statusA.localeCompare(statusB)
					: statusB.localeCompare(statusA);
			}
		});

		setTeams(sortedTeams);
	};

	const handleDelete = async (teamId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			const response = await fetch(`/api/teams/${teamId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete team");
			}

			toast.success("Team successfully removed");
			// Refresh the teams list
			fetchTeams();
		} catch (error) {
			console.error("Error deleting team:", error);
		}
	};

	const getTeamStatus = (team: Team): string => {
		if (team.isDisqualified) return "Disqualified";
		if (!team.members || team.members.length === 0) return "Empty";
		return "Qualified";
	};

	const getStatusBadgeVariant = (
		team: Team
	): "destructive" | "success" | "secondary" => {
		if (team.isDisqualified) return "destructive";
		if (!team.members || team.members.length === 0) return "secondary";
		return "success";
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
				<RefreshCw className="h-8 w-8 animate-spin text-gray-500 mb-4" />
				<h3 className="text-lg font-medium">Loading...</h3>
			</div>
		);
	}

	return (
		<Card className="min-h-screen border-none w-full relative shadow-sm">
			<CardContent className="p-6">
				{stepCreateTeam && (
					<div className="fixed inset-0 z-50 w-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
						<CreateTeam
							onClose={() => {
								setStepCreateTeam(false);
								fetchTeams();
							}}
						/>
					</div>
				)}

				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Teams</h1>
					<Button
						onClick={() => setStepCreateTeam(true)}
						className="flex items-center gap-2 bg-black hover:bg-gray-800"
					>
						<UserPlus size={16} />
						Create New Team
					</Button>
				</div>

				<div className="overflow-x-auto rounded-lg border border-gray-200">
					<Table>
						<TableHeader className="bg-gray-50">
							<TableRow>
								<TableHead
									className="cursor-pointer hover:text-gray-700 transition-colors"
									onClick={() => handleSort("name")}
								>
									<div className="flex items-center gap-1 text-gray-900">
										Name
										<ArrowUpDown size={14} />
									</div>
								</TableHead>
								<TableHead className="text-gray-900">Members</TableHead>
								<TableHead
									className="cursor-pointer hover:text-gray-700 transition-colors"
									onClick={() => handleSort("status")}
								>
									<div className="flex items-center gap-1 text-gray-900">
										Status
										<ArrowUpDown size={14} />
									</div>
								</TableHead>
								<TableHead className="text-gray-900 w-16">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{teams.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="text-center py-8 text-gray-500"
									>
										No teams found. Create a new team to get started.
									</TableCell>
								</TableRow>
							) : (
								teams.map((team) => (
									<TableRow
										key={team.id}
										className="hover:bg-gray-50 transition-colors border-b border-gray-100"
									>
										<TableCell className="font-medium flex items-center">
											<Link
												href={`/admin/teams/${team.id}`}
												className="truncate max-w-xs"
											>
												{team.name}
											</Link>
										</TableCell>
										<TableCell className="text-gray-700">
											{team.members && team.members.length > 0 ? (
												<ul className="space-y-1">
													{team.members.map((m) => (
														<li key={m.id} className="text-sm">
															{m.name || "Unnamed member"}
														</li>
													))}
												</ul>
											) : (
												<span className="text-gray-400 text-sm">
													No members
												</span>
											)}
										</TableCell>
										<TableCell>
											<Badge
												variant={getStatusBadgeVariant(team)}
												className="font-normal"
											>
												{getTeamStatus(team)}
											</Badge>
										</TableCell>
										<TableCell
											className="text-right"
											onClick={(e) => e.stopPropagation()}
										>
											<PopupDelete
												item="Team"
												onDelete={(e: React.MouseEvent) => {
													handleDelete(team.id, e);
												}}
											/>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};

export default ShowTeam;
