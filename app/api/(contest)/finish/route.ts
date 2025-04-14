import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

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

		await db.submission.update({
			where: { id: contestId },
			data: {
				isFinish: true,
				totalProblemsSolved: submissionProblems.length,
				completionTime: Math.floor(diffMs / 1000),
				submittedAt: new Date(),
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
