import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the import path to your Prisma client
import { BatchSchema } from "@/lib/zod";
import { z } from "zod";

// GET Single Batch
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const batchId = (await params).id;

		// Validate batch ID
		if (!batchId) {
			return NextResponse.json(
				{ message: "Batch ID is required" },
				{ status: 400 }
			);
		}

		// Fetch batch with related problems, languages, and test cases
		const batch = await db.batch.findUnique({
			where: { id: batchId },
			include: {
				problems: {
					include: {
						languages: true,
						testCases: true,
					},
				},
			},
		});

		if (!batch) {
			return NextResponse.json({ message: "Batch not found" }, { status: 404 });
		}

		return NextResponse.json(batch, { status: 200 });
	} catch (error) {
		console.error("Error fetching batch:", error);
		return NextResponse.json(
			{ message: "Failed to fetch batch" },
			{ status: 500 }
		);
	}
}

// PUT Update Batch
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const batchId = (await params).id;
		const body = await request.json();

		// Validate request body against BatchSchema
		const validatedData = BatchSchema.parse(body);

		await db.$transaction(async (db) => {
			await db.problem.deleteMany({
				where: { batchId },
			});

			// Update batch metadata
			const batch = await db.batch.update({
				where: { id: batchId },
				data: {
					title: validatedData.title,
					description: validatedData.description,
					timer: parseInt(validatedData.timer),
					publish: validatedData.publish,
					startedAt: new Date(validatedData.startedAt),
				},
			});

			// Create new problems with languages and test cases
			for (const problemData of validatedData.problems) {
				await db.problem.create({
					data: {
						batchId: batch.id,
						title: problemData.title,
						description: problemData.description,
						functionExecution: problemData.functionExecution,
						languages: {
							create: problemData.languages.map((lang) => ({
								name: lang.name,
								languageId: lang.languageId,
								functionTemplate: lang.functionTemplate,
							})),
						},
						testCases: {
							create: problemData.testCases.map((testCase) => ({
								input: testCase.input,
								output: testCase.output,
							})),
						},
					},
				});
			}
		});

		return NextResponse.json(
			{
				message: "Batch updated successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating batch:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: error.errors,
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ message: "Failed to update batch" },
			{ status: 500 }
		);
	}
}

// DELETE Batch
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const batchId = (await params).id;

		// Delete batch (cascading delete will handle related records)
		const deletedBatch = await db.batch.delete({
			where: { id: batchId },
		});

		return NextResponse.json(
			{
				message: "Batch deleted successfully",
				batch: deletedBatch,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting batch:", error);
		return NextResponse.json(
			{ message: "Failed to delete batch" },
			{ status: 500 }
		);
	}
}
