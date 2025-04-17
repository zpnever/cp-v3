import { db } from "@/lib/db";
import { getScore } from "@/utils/scoring";

export const POST = async (req: Request) => {
	const body = await req.json();
	const { contestId, teamId } = body;

	if (!contestId || !teamId) {
		return Response.json({ message: "Missing params" }, { status: 400 });
	}

	const submission = await db.submission.findFirst({
		where: {
			teamId,
			id: contestId,
		},
		include: {
			batch: {
				include: {
					problems: true,
				},
			},
			submissionProblems: true,
		},
	});

	if (!submission) {
		return Response.json({ message: "Submission not found" }, { status: 404 });
	}

	if (submission.isFinish) {
		return Response.json(
			{ message: "Submission already finalized" },
			{ status: 400 }
		);
	}

	const completionTime = submission.batch.timer * 60;

	const memoryUsages = submission.submissionProblems.map(
		(s) => s.memory ?? null
	);
	const executionTimes = submission.submissionProblems.map(
		(s) => s.executionTime ?? null
	);

	const solvedCount = submission.submissionProblems.filter(
		(s) => s.success
	).length;

	const score = getScore({
		solvedCount,
		totalProblems: submission.batch.problems.length,
		memoryUsages,
		executionTimes,
		maxCompletionTime: completionTime,
		completionTime,
	});

	await db.submission.update({
		where: { id: contestId },
		data: {
			isFinish: true,
			totalProblemsSolved: solvedCount,
			completionTime,
			submittedAt: new Date(),
			score,
		},
	});

	return Response.json({ success: true, score }, { status: 200 });
};
