import { db } from "@/lib/db";

export const POST = async (req: Request) => {
	const body = await req.json();
	const { contestId, teamId } = body;

	if (!contestId || !teamId) {
		return Response.json({ message: "Missing params" }, { status: 400 });
	}

	const submissionProblems = await db.submissionProblem.findMany({
		where: {
			teamId,
			submissionId: contestId,
		},
	});

	const submission = await db.submission.findFirst({
		where: {
			id: contestId,
		},
		include: {
			batch: true,
		},
	});

	if (!submission) {
		return Response.json({ message: "Submission not found" }, { status: 404 });
	}

	const completionTime = submission.batch.timer * 60;

	await db.submission.update({
		where: { id: contestId },
		data: {
			isFinish: true,
			totalProblemsSolved: submissionProblems.length,
			completionTime,
			submittedAt: new Date(),
		},
	});
};
