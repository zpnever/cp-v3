import { db } from "@/lib/db";
import { BatchSchema } from "@/lib/zod";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	try {
		const body = await req.json();

		const validateFields = BatchSchema.safeParse(body);

		if (!validateFields.success)
			return NextResponse.json({ message: "Invalid fields" }, { status: 400 });

		const { title, description, startedAt, timer, publish, problems } =
			validateFields.data;

		if (!title || !description || !timer || problems.length < 1) {
			return NextResponse.json(
				{ message: "Please, filled all fields" },
				{ status: 400 }
			);
		}

		// Buat batch baru di database
		await db.batch.create({
			data: {
				title,
				description,
				timer: parseInt(timer),
				publish,
				startedAt: new Date(startedAt),
				problems: {
					create: problems.map((prob) => ({
						title: prob.title,
						description: prob.description,
						testCases: {
							create: prob.testCases.map((c) => ({
								input: c.input,
								output: c.output,
							})),
						},
						functionExecution: prob.functionExecution,
						languages: {
							create: prob.languages.map((lang) => ({
								name: lang.name,
								languageId: lang.languageId,
								functionTemplate: lang.functionTemplate,
							})),
						},
					})),
				},
			},
		});

		return NextResponse.json(
			{ message: "Batch created successfully! 🎉" },
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

export const GET = async () => {
	const batch = await db.batch.findMany({
		include: {
			problems: true,
		},
	});

	return NextResponse.json({ data: batch }, { status: 200 });
};
