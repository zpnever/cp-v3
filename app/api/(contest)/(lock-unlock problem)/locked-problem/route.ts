import redis from "@/lib/redis";
import { NextResponse } from "next/server";

interface ILockedProblem {
	userId: string;
	problemId: string;
}

interface IBody {
	contestId: string;
	teamId: string;
	problemId: string;
	userId: string;
}

export const POST = async (req: Request) => {
	const body = await req.json();
	const { contestId, teamId, problemId, userId }: IBody = body;

	const key = `locked-problem:${contestId}:${teamId}`;

	try {
		const existing = await redis.get(key);
		let parsed: ILockedProblem[] = [];

		if (existing) {
			parsed = JSON.parse(existing) as ILockedProblem[];
		}

		// Deleted existing user
		parsed = parsed.filter((item) => item.userId !== userId);

		// Add new user locked
		parsed.push({ userId, problemId });

		await redis.set(key, JSON.stringify(parsed), "EX", 1800); // 30menit

		return NextResponse.json({ message: "Success" }, { status: 200 });
	} catch (error) {
		console.error("Redis Error:", error);
		return NextResponse.json({ message: "Error" }, { status: 500 });
	}
};
