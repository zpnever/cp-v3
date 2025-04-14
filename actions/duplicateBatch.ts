"use server";

import { db } from "@/lib/db";

export const duplicateBatch = async (batchId: string) => {
	try {
		const batch = await db.batch.findFirst({
			where: {
				id: batchId,
			},
			include: {
				problems: {
					include: {
						languages: true,
						testCases: true,
					},
				},
			},
		});

		if (!batch) return { error: "Batch is not found" };

		await db.batch.create({
			data: {
				title: batch.title,
				description: batch.description,
				publish: batch.publish,
				timer: batch.timer,
				startedAt: batch.startedAt,
				problems: {
					create: batch.problems.map((prob) => ({
						title: prob.title,
						description: prob.description,
						functionExecution: prob.functionExecution,
						languages: {
							create: prob.languages.map((lang) => ({
								name: lang.name,
								languageId: lang.languageId,
								functionTemplate: lang.functionTemplate,
							})),
						},
						testCases: {
							create: prob.testCases.map((test) => ({
								input: test.input,
								output: test.output,
							})),
						},
					})),
				},
			},
		});
	} catch (err) {
		return { error: "Invalid Server Error" };
	}
};
