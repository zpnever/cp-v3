"use client";

import { User } from "@/lib/types";
import { RefreshCw, UserPlus, ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateUser from "@/components/users/CreateUser";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import PopupDelete from "../batch-form/ui/popup-delete";

const ShowUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [stepCreateUser, setStepCreateUser] = useState(false);
	const [sortConfig, setSortConfig] = useState({
		key: "name",
		direction: "asc",
	});

	const router = useRouter();

	useEffect(() => {
		const getUsers = async () => {
			try {
				const res = await fetch(`/api/users`);
				const json = await res.json();

				if (!res.ok) {
					toast.error(json.message);
					throw new Error("Invalid get users data");
				}

				setUsers(json.users);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
				toast.error("Something wrong!");
				setIsLoading(false);
			}
		};

		getUsers();
	}, [stepCreateUser]);

	const handleSort = (key: "name" | "status") => {
		let direction = "asc";

		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });

		const sortedUsers = [...users].sort((a, b) => {
			if (key === "status") {
				// Sort by verification status
				const aStatus = a.isDisqualified
					? "disqualified"
					: a.isVerified
					? "qualified"
					: "pending";
				const bStatus = b.isDisqualified
					? "disqualified"
					: b.isVerified
					? "qualified"
					: "pending";

				if (aStatus < bStatus) {
					return direction === "asc" ? -1 : 1;
				}
				if (aStatus > bStatus) {
					return direction === "asc" ? 1 : -1;
				}
				return 0;
			} else {
				// Sort by name or other fields
				if (a[key]! < b[key]!) {
					return direction === "asc" ? -1 : 1;
				}
				if (a[key]! > b[key]!) {
					return direction === "asc" ? 1 : -1;
				}
				return 0;
			}
		});

		setUsers(sortedUsers);
	};

	const handleDelete = async (userId: string, e: React.MouseEvent) => {
		e.stopPropagation();

		try {
			const res = await fetch(`/api/users/${userId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const json = await res.json();

			if (!res.ok) {
				toast.error(json.message);
			} else {
				toast.success(json.message);
				// Update the users list after successful deletion
				setUsers(users.filter((user) => user.id !== userId));
			}
		} catch (error) {
			toast.error("Failed to delete user");
		}
	};

	const getUserStatus = (user: User) => {
		if (user.isDisqualified) return "Disqualified";
		if (user.isVerified) return "Qualified";
		return "Not Registered";
	};

	const getStatusBadgeVariant = (user: User) => {
		if (user.isDisqualified) return "destructive";
		if (user.isVerified) return "success";
		return "outline";
	};

	// Simplified monochrome avatar style
	const getMonochromeAvatarStyle = (user: User) => {
		// Generate a consistent background shade based on user id or email
		const hash = user.email
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);

		// Monochrome color palette (different shades of gray)
		const monochromeColors = [
			"bg-gray-100",
			"bg-gray-200",
			"bg-gray-300",
			"bg-zinc-100",
			"bg-zinc-200",
			"bg-slate-100",
		];

		return monochromeColors[hash % monochromeColors.length];
	};

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3 justify-center items-center h-[90vh]">
				<RefreshCw className="animate-spin text-gray-600" size={32} />
				<div>Loading Users...</div>
			</div>
		);
	}

	return (
		<Card className="min-h-screen border-none shadow-sm">
			<CardContent className="p-6">
				{stepCreateUser && (
					<div className="fixed inset-0 z-50 w-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
						<CreateUser
							onClose={() => {
								setStepCreateUser(false);
							}}
						/>
					</div>
				)}

				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Users</h1>
					<Button
						onClick={() => setStepCreateUser(true)}
						className="flex items-center gap-2 bg-black hover:bg-gray-800"
					>
						<UserPlus size={16} />
						Create New User
					</Button>
				</div>

				<div className="overflow-x-auto">
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
								<TableHead className="text-gray-900">Email</TableHead>
								<TableHead
									className="cursor-pointer hover:text-gray-700 transition-colors"
									onClick={() => handleSort("status")}
								>
									<div className="flex items-center gap-1 text-gray-900">
										Status
										<ArrowUpDown size={14} />
									</div>
								</TableHead>
								<TableHead className="text-gray-900">Role</TableHead>
								<TableHead className="text-gray-900 w-16">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => {
								const avatarStyle = getMonochromeAvatarStyle(user);

								return (
									<TableRow
										key={user.id}
										className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
									>
										<TableCell
											className="font-medium flex items-center gap-3"
											onClick={() => router.push(`/admin/users/${user.id}`)}
										>
											<Avatar className={`h-10 w-10 ${avatarStyle}`}>
												<AvatarImage
													src={
														user.photo ||
														"https://res.cloudinary.com/dcppvp6n6/image/upload/v1743202836/cp_assets/xbx9kldire0p12e0xraw.jpg"
													}
													alt={user.name || "User"}
												/>
											</Avatar>
											<span className="truncate max-w-[200px]">
												{user.name || "Unnamed User"}
											</span>
										</TableCell>
										<TableCell
											className="text-gray-700"
											onClick={() => router.push(`/admin/users/${user.id}`)}
										>
											{user.email}
										</TableCell>
										<TableCell
											onClick={() => router.push(`/admin/users/${user.id}`)}
										>
											<Badge
												variant={getStatusBadgeVariant(user)}
												className="font-normal"
											>
												{getUserStatus(user)}
											</Badge>
										</TableCell>
										<TableCell
											className="text-gray-700"
											onClick={() => router.push(`/admin/users/${user.id}`)}
										>
											{user.role}
										</TableCell>
										<TableCell
											className="text-right"
											onClick={(e) => e.stopPropagation()}
										>
											<PopupDelete
												item="User"
												onDelete={(e: React.MouseEvent) => {
													handleDelete(user.id, e);
												}}
											/>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};

export default ShowUsers;
