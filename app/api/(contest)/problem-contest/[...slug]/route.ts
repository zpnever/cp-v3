import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ slug: string[] }> }
) => {
	const { slug } = await params;
	const [teamId, problemId] = slug;

	if (!problemId || !teamId)
		return NextResponse.json({ message: "Invalid id" }, { status: 400 });

	const problem = await db.problem.findFirst({
		where: {
			id: problemId,
		},
		include: {
			languages: true,
		},
	});

	const submissionProblem = await db.submissionProblem.findFirst({
		where: {
			problemId,
			teamId,
		},
	});

	if (!problem)
		return NextResponse.json(
			{ message: "Can't find problem" },
			{ status: 400 }
		);

	return NextResponse.json(
		{ message: "Succesfully", data: { problem, submissionProblem } },
		{ status: 200 }
	);
};
