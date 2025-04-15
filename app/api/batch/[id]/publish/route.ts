import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const batchId = (await params).id;

		const batch = await db.batch.findUnique({
			where: {
				id: batchId,
			},
			include: {
				problems: true,
			},
		});

		const batchTeamExisted = await db.batch.findUnique({
			where: {
				id: batchId,
			},
			include: {
				teams: {
					include: {
						team: true,
					},
				},
			},
		});

		if (!batch) {
			return NextResponse.json({ message: "Batch not found" }, { status: 404 });
		}

		const teams = await db.team.findMany();

		return NextResponse.json(
			{
				batch,
				teams,
				assignedBatch: batchTeamExisted?.teams,
				message: "Success fetch data",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const POST = async (
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const batchId = (await params).id;
		const { teamsId } = await req.json();

		const batch = await db.batch.findUnique({
			where: {
				id: batchId,
			},
		});

		await db.$transaction([
			db.batchTeam.deleteMany({
				where: {
					batchId: batchId,
					teamId: { notIn: teamsId },
				},
			}),

			db.submission.deleteMany({
				where: {
					batchId: batchId,
					teamId: { notIn: teamsId },
				},
			}),

			// Tambahkan Team yang belum ada
			db.batchTeam.createMany({
				data: teamsId.map((teamId: string) => ({
					batchId: batchId,
					teamId: teamId,
				})),
				skipDuplicates: true,
			}),

			db.submission.createMany({
				data: teamsId.map((teamId: string) => ({
					teamId,
					batchId,
					startAt: batch?.startedAt,
				})),
				skipDuplicates: true,
			}),
		]);

		return NextResponse.json(
			{ message: "Successfully publish batch" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
