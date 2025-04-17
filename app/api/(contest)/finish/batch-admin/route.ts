import { db } from "@/lib/db";
import { getScore } from "@/utils/scoring";

export const POST = async (req: Request) => {
	const body = await req.json();
	const { batchId } = body;

	if (!batchId) {
		return Response.json({ message: "Missing params" }, { status: 400 });
	}

	const unFinishedSubmissions = await db.submission.findMany({
		where: {
			batchId,
			isFinish: false,
		},
		include: {
			submissionProblems: true,
			batch: {
				include: {
					problems: true,
				},
			},
		},
	});

	await Promise.all(
		unFinishedSubmissions.map((submission) => {
			const completionTime = submission.batch.timer * 60;
			const memoryUsages = submission.submissionProblems.map(
				(s) => s.memory ?? null
			);
			const executionTimes = submission.submissionProblems.map(
				(s) => s.executionTime ?? null
			);

			const submissionResult = {
				solvedCount: submission.submissionProblems.length,
				totalProblems: submission.batch.problems.length,
				memoryUsages,
				executionTimes,
				maxCompletionTime: completionTime,
				completionTime,
			};

			const score = getScore(submissionResult);

			return db.submission.update({
				where: { id: submission.id },
				data: {
					isFinish: true,
					totalProblemsSolved: submission.submissionProblems.length,
					completionTime,
					submittedAt: new Date(),
					score,
				},
			});
		})
	);

	return Response.json({ success: true }, { status: 200 });
};
