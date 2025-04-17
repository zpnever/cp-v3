import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { getScore } from "@/utils/scoring";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const contestId = searchParams.get("contestId");
	const teamId = searchParams.get("teamId");

	if (!contestId || !teamId) {
		return Response.json({ error: "Missing params" }, { status: 400 });
	}

	const key = `finish:${contestId}:${teamId}`;
	const finished = await redis.smembers(key);

	return Response.json({ finished });
}

export async function POST(req: Request) {
	const { contestId, teamId, userId, totalMember } = await req.json();

	if (!contestId || !teamId || !userId) {
		return Response.json({ error: "Missing params" }, { status: 400 });
	}

	const key = `finish:${contestId}:${teamId}`;
	await redis.sadd(key, userId);

	const finished = await redis.smembers(key);

	// submit
	if (finished.length === totalMember) {
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
			return Response.json(
				{ message: "Submission not found" },
				{ status: 404 }
			);
		}

		const startedAt = new Date(submission?.startAt);
		const endedAt = new Date();
		const diffMs = endedAt.getTime() - startedAt.getTime();
		const completionTime = Math.floor(diffMs / 1000);
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
			maxCompletionTime: submission.batch.timer * 60,
			completionTime,
		};

		const score = getScore(submissionResult);

		await db.submission.update({
			where: { id: contestId },
			data: {
				isFinish: true,
				totalProblemsSolved: submission.submissionProblems.length,
				completionTime,
				submittedAt: new Date(),
				score,
			},
		});
	}

	return Response.json({ success: true, finished });
}

export async function DELETE(req: Request) {
	const { contestId, teamId, userId } = await req.json();

	if (!contestId || !teamId || !userId) {
		return Response.json({ error: "Missing params" }, { status: 400 });
	}

	const key = `finish:${contestId}:${teamId}`;
	await redis.srem(key, userId);

	return Response.json({ success: true });
}
