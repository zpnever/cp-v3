// app/api/execute/route.ts
import { db } from "@/lib/db";
import { submissionQueue } from "@/lib/queue";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();
	const { userId, teamId, contestId, problemId, code, languageId } = body;

	const problem = await db.problem.findFirst({
		where: {
			id: problemId,
		},
		include: {
			testCases: true,
		},
	});

	const testCases = problem?.testCases.map((tc) => ({
		input: tc.input,
		output: tc.output,
	}));

	const functionName = problem?.functionExecution;

	if (
		!userId ||
		!contestId ||
		!problemId ||
		!code ||
		!languageId ||
		!problem ||
		!testCases ||
		!functionName ||
		!teamId
	) {
		return NextResponse.json({ message: "" }, { status: 400 });
	}

	const job = await submissionQueue.add("runCode", {
		userId,
		teamId,
		contestId,
		problemId,
		testCases,
		code,
		functionName,
		languageId,
	});

	return NextResponse.json({ message: "success" }, { status: 200 });
}
