import redis from "@/lib/redis";
import { NextResponse } from "next/server";

interface ILockedProblem {
	userId: string;
	problemId: string;
}

export const POST = async (req: Request) => {
	const body = await req.json();
	const { contestId, teamId, userId } = body;

	const key = `locked-problem:${contestId}:${teamId}`;

	try {
		const existing = await redis.get(key);
		let parsed: ILockedProblem[] = [];

		if (existing) {
			parsed = JSON.parse(existing) as ILockedProblem[];
		}

		parsed = parsed.filter((item) => item.userId !== userId);

		await redis.set(key, JSON.stringify(parsed), "EX", 1800); // 30 menit

		return NextResponse.json({ message: "Success" }, { status: 200 });
	} catch (error) {
		console.error("Redis Error:", error);
		return NextResponse.json({ message: "Error" }, { status: 500 });
	}
};
