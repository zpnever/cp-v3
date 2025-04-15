import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
	const submissionBatch = await db.batch.findMany({
		include: {
			submissions: {
				include: {
					submissionProblems: true,
				},
			},
		},
	});

	const team = await db.team.findMany({
		include: {
			submissions: true,
		},
	});

	if (!submissionBatch)
		return NextResponse.json(
			{ message: "Can't fetch batch submission" },
			{ status: 400 }
		);

	return NextResponse.json(
		{ message: "success", data: { submissionBatch, team } },
		{ status: 200 }
	);
};
