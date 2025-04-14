import { db } from "@/lib/db";
import redis from "@/lib/redis";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ slug: string[] }> }
) => {
	const { slug } = await params;
	const [teamId, contestId] = slug;

	if (!contestId)
		return NextResponse.json(
			{ message: "Invalid contest id" },
			{ status: 400 }
		);

	const submission = await db.submission.findFirst({
		where: {
			id: contestId,
		},
		include: {
			submissionProblems: true,
		},
	});

	if (!submission)
		return NextResponse.json(
			{ message: "Your contest is not found" },
			{ status: 400 }
		);

	const batch = await db.batch.findFirst({
		where: {
			id: submission.batchId,
		},
		include: {
			problems: true,
		},
	});

	if (!batch)
		return NextResponse.json(
			{ message: "Your contest is not found" },
			{ status: 400 }
		);

	return NextResponse.json(
		{ message: "Success", data: { submission, batch } },
		{ status: 200 }
	);
};
