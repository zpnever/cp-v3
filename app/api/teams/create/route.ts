import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	const body = await req.json();
	const { teams } = body;

	if (teams.length === 0) {
		return NextResponse.json({ message: "Teams is required" }, { status: 400 });
	}

	await Promise.all(
		teams.map(async (t: any) => {
			const existingTeam = await db.team.findUnique({
				where: { name: t.name },
			});

			if (existingTeam) {
				return;
			}

			await db.team.create({
				data: {
					name: t.name,
					members: {
						connect: t.memberIds.map((id: string) => ({ id })),
					},
				},
			});
		})
	);

	return NextResponse.json({ message: "success" }, { status: 200 });
};
