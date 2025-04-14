import redis from "@/lib/redis";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ slug: string[] }> }
) => {
	const { slug } = await params;
	const [contestId, teamId] = slug;

	const key = `locked-problem:${contestId}:${teamId}`;
	const data = await redis.get(key);

	if (!data) {
		return NextResponse.json({ lockedProblem: [] }, { status: 200 });
	}

	const lockedProblem = JSON.parse(data);

	return NextResponse.json({ lockedProblem }, { status: 200 });
};
