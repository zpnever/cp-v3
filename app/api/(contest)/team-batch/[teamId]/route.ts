import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ teamId: string }> }
) => {
	const teamId = (await params).teamId;

	if (!teamId)
		return NextResponse.json(
			{ message: "Invalid team id and batch id" },
			{ status: 400 }
		);

	const team = await db.team.findUnique({
		where: { id: teamId },
		include: {
			batches: {
				where: {
					batch: {
						publish: true,
					},
				},
				include: {
					batch: true,
				},
			},
			submissions: true,
		},
	});

	if (!team)
		return NextResponse.json({ message: "data is not found" }, { status: 404 });

	return NextResponse.json({ data: team }, { status: 200 });
};
