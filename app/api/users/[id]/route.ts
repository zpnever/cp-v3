import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const userId = (await params).id;
		const users = await db.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!users)
			return NextResponse.json(
				{ message: "Users is not found" },
				{ status: 200 }
			);

		return NextResponse.json(
			{ users, message: "Successfully get users" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

// DELETE USER
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const userId = (await params).id;

		await db.user.delete({
			where: { id: userId },
		});

		return NextResponse.json(
			{
				message: "User deleted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting user:", error);
		return NextResponse.json(
			{ message: "Failed to delete user" },
			{ status: 500 }
		);
	}
}
