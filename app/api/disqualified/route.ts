import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	const body = await req.json();
	const { teamIds } = body;

	if (teamIds.length === 0 || !teamIds)
		return NextResponse.json(
			{ message: "TeamIds is required" },
			{ status: 400 }
		);

	await Promise.all(
		teamIds.map((id: string) => {
			return db.team.update({
				where: {
					id,
				},
				data: {
					isDisqualified: true,
				},
			});
		})
	);

	return NextResponse.json(
		{ message: "Successfully disqualified team" },
		{ status: 200 }
	);
};
