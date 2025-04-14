"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Search, UserPlus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import * as z from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { User } from "@/lib/types";

interface Teams {
	name: string;
	memberIds: string[];
}

// Define the schema for team creation
const TeamSchema = z.object({
	name: z.string().min(1, "Team name is required"),
});

const CreateTeam = ({ onClose }: { onClose: () => void }) => {
	const [isPending, startTransition] = useTransition();
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [teams, setTeams] = useState<Teams[]>([{ name: "", memberIds: [] }]);
	const [showSearch, setShowSearch] = useState(false);
	const [activeTeamIndex, setActiveTeamIndex] = useState(0);

	// Form setup for each team
	const form = useForm<z.infer<typeof TeamSchema>>({
		resolver: zodResolver(TeamSchema),
		defaultValues: {
			name: "",
		},
	});

	// Load all users on component mount
	useEffect(() => {
		const getUsers = async () => {
			try {
				const res = await fetch("/api/users");
				const json = await res.json();

				if (!res.ok) {
					throw new Error("Failed to get users");
				}

				setAllUsers(json.users || []);
			} catch (error) {
				toast.error("Failed to get users");
				console.error(error);
			}
		};

		getUsers();
	}, []);

	// Update form values when active team changes
	useEffect(() => {
		form.setValue("name", teams[activeTeamIndex].name);
	}, [activeTeamIndex, teams, form]);

	// Search users
	useEffect(() => {
		if (searchQuery.trim() === "") {
			setSearchResults([]);
			return;
		}

		const query = searchQuery.toLowerCase();
		const filteredUsers = allUsers.filter(
			(user) =>
				user.name?.toLowerCase().includes(query) ||
				user.email?.toLowerCase().includes(query)
		);
		setSearchResults(filteredUsers);
	}, [searchQuery, allUsers]);

	// Handle team name change
	const handleTeamNameChange = (value: string) => {
		const updatedTeams = [...teams];
		updatedTeams[activeTeamIndex].name = value;
		setTeams(updatedTeams);
	};

	// Add user to team
	const addUserToTeam = (user: User, teamIndex: number) => {
		const updatedTeams = [...teams];

		// Check if user already exists in the team
		if (!updatedTeams[teamIndex].memberIds.includes(user?.id)) {
			updatedTeams[teamIndex].memberIds.push(user.id);
			setTeams(updatedTeams);
			toast.success(`${user.name || user.email} added to team`);
		} else {
			toast.error("User already in team");
		}

		// Clear search
		setSearchQuery("");
		setShowSearch(false);
	};

	// Remove user from team
	const removeUserFromTeam = (userId: string, teamIndex: number) => {
		const updatedTeams = [...teams];
		updatedTeams[teamIndex].memberIds = updatedTeams[
			teamIndex
		].memberIds.filter((id) => id !== userId);
		setTeams(updatedTeams);
		toast.success("User removed from team");
	};

	// Add a new team
	const addNewTeam = () => {
		setTeams([...teams, { name: "", memberIds: [] }]);
		setActiveTeamIndex(teams.length);
	};

	// Remove a team
	const removeTeam = (index: number) => {
		if (teams.length === 1) {
			toast.error("You need at least one team");
			return;
		}

		const updatedTeams = teams.filter((_, i) => i !== index);
		setTeams(updatedTeams);

		// Update active team index if needed
		if (activeTeamIndex >= updatedTeams.length) {
			setActiveTeamIndex(updatedTeams.length - 1);
		}
	};

	// Get user details by ID
	const getUserById = (userId: string) => {
		return (
			allUsers.find((user) => user.id === userId) || {
				name: "Unknown",
				email: "unknown",
			}
		);
	};

	// Handle form submission
	const onSubmit = (data: z.infer<typeof TeamSchema>) => {
		// Update the active team with the form data
		const updatedTeams = [...teams];
		updatedTeams[activeTeamIndex].name = data.name;
		setTeams(updatedTeams);

		// Validate all teams have names
		const invalidTeams = updatedTeams.filter((team) => !team.name.trim());
		if (invalidTeams.length > 0) {
			toast.error("All teams must have names");
			return;
		}

		// Validate all teams have members
		const emptyTeams = updatedTeams.filter(
			(team) => team.memberIds.length === 0
		);
		if (emptyTeams.length > 0) {
			toast.error("All teams must have at least one member");
			return;
		}

		startTransition(async () => {
			try {
				const res = await fetch(`/api/teams/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ teams: updatedTeams }),
				});

				if (!res.ok) {
					throw new Error("Failed to create teams");
				}

				toast.success("Teams created successfully");
				onClose();
			} catch (error) {
				toast.error("Failed to create teams");
				console.error(error);
			}
		});
	};

	return (
		<div className="max-w-[80%] min-w-[60%] mx-auto bg-white border relative border-neutral-200 rounded-lg p-8 shadow-sm">
			<Button
				onClick={onClose}
				variant="ghost"
				size="icon"
				className="absolute top-3 right-3 h-10 w-10 cursor-pointer"
			>
				<X size={18} />
			</Button>

			<h1 className="text-center font-bold text-2xl mb-8">Create Teams</h1>

			{/* Tabs for multiple teams */}
			<div className="flex flex-wrap gap-2 mb-6">
				{teams.map((team, index) => (
					<div key={index} className="relative">
						<Button
							variant={activeTeamIndex === index ? "default" : "outline"}
							onClick={() => setActiveTeamIndex(index)}
							className="flex items-center gap-2 pr-8 relative" // beri padding kanan agar icon x nggak nabrak
						>
							{team.name || `Team ${index + 1}`}
						</Button>

						{teams.length > 1 && (
							<span
								className={
									activeTeamIndex === index
										? "absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 hover:bg-gray-800 rounded cursor-pointer text-white"
										: " text-black absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 hover:bg-gray-200 rounded cursor-pointer"
								}
								onClick={(e) => {
									e.stopPropagation();
									removeTeam(index);
								}}
							>
								<X size={14} />
							</span>
						)}
					</div>
				))}

				<Button variant="outline" onClick={addNewTeam}>
					+ Add Team
				</Button>
			</div>

			{/* Active Team Form */}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<Card>
						<CardHeader>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Team Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Enter team name"
												onChange={(e) => {
													field.onChange(e);
													handleTeamNameChange(e.target.value);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardHeader>

						<CardContent>
							<div className="mb-4">
								<div className="flex items-center justify-between mb-2">
									<FormLabel>Team Members</FormLabel>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setShowSearch(true)}
										className="flex items-center gap-1"
										type="button"
									>
										<UserPlus size={16} />
										Add Members
									</Button>
								</div>

								{/* Team members list */}
								<div className="border rounded-md mt-2">
									{teams[activeTeamIndex].memberIds.length === 0 ? (
										<div className="p-4 text-center text-gray-500">
											No members added to this team yet
										</div>
									) : (
										<ul className="divide-y">
											{teams[activeTeamIndex].memberIds.map((userId) => {
												const user = getUserById(userId);
												return (
													<li
														key={userId}
														className="flex items-center justify-between p-3"
													>
														<div>
															<div className="font-medium">{user.name}</div>
															<div className="text-sm text-gray-500">
																{user.email}
															</div>
														</div>
														<Button
															variant="ghost"
															size="sm"
															onClick={() =>
																removeUserFromTeam(userId, activeTeamIndex)
															}
															type="button"
														>
															<Trash2 size={16} className="text-red-500" />
														</Button>
													</li>
												);
											})}
										</ul>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="mt-6 flex justify-end">
						<Button type="submit" disabled={isPending} className="px-6">
							{isPending ? "Creating..." : "Create Teams"}
						</Button>
					</div>
				</form>
			</Form>

			{/* User search dialog */}
			<Dialog open={showSearch} onOpenChange={setShowSearch}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Team Members</DialogTitle>
						<DialogDescription>
							Search for users by name or email to add to the team.
						</DialogDescription>
					</DialogHeader>

					<div className="mt-4">
						<div className="relative">
							<Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search by name or email"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-8"
							/>
						</div>

						<div className="mt-4 max-h-64 overflow-y-auto">
							{searchResults.length === 0 && searchQuery.trim() !== "" ? (
								<div className="text-center py-4 text-gray-500">
									No users found
								</div>
							) : (
								<ul className="divide-y">
									{searchResults.map((user) => (
										<li
											key={user.id}
											className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 cursor-pointer"
											onClick={() => addUserToTeam(user, activeTeamIndex)}
										>
											<div>
												<div className="font-medium">{user.name}</div>
												<div className="text-sm text-gray-500">
													{user.email}
												</div>
											</div>
											<Button size="sm" variant="ghost" type="button">
												<UserPlus size={16} />
											</Button>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CreateTeam;
