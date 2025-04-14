import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
	const teams = await db.team.findMany({
		include: {
			members: true,
		},
	});

	return NextResponse.json({ teams }, { status: 200 });
};
