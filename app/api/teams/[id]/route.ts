import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// DELETE TEAM
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const teamId = (await params).id;

		await db.team.delete({
			where: { id: teamId },
		});

		return NextResponse.json(
			{
				message: "Batch deleted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting batch:", error);
		return NextResponse.json(
			{ message: "Failed to delete batch" },
			{ status: 500 }
		);
	}
}
