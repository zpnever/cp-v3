import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the import path to your Prisma client

// GET Single Batch
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const batchId = (await params).id;

		// Validate batch ID
		if (!batchId) {
			return NextResponse.json(
				{ message: "Batch ID is required" },
				{ status: 400 }
			);
		}

		const batch = await db.batch.findUnique({
			where: { id: batchId },
			include: {
				problems: {
					include: {
						languages: true,
						testCases: true,
					},
				},
			},
		});

		const batchUser = await db.batch.findUnique({
			where: {
				id: batchId,
			},
			include: {
				teams: {
					include: {
						team: true,
					},
				},
			},
		});

		if (!batch) {
			return NextResponse.json({ message: "Batch not found" }, { status: 404 });
		}

		return NextResponse.json({ batch, batchUser }, { status: 200 });
	} catch (error) {
		console.error("Error fetching batch:", error);
		return NextResponse.json(
			{ message: "Failed to fetch batch" },
			{ status: 500 }
		);
	}
}
