"use server";

import { db } from "@/lib/db";
import { CreateUserSchema, FormCreateUserType } from "@/lib/zod";

export const createUser = async (values: FormCreateUserType) => {
	try {
		const validateFields = CreateUserSchema.safeParse(values);
		if (!validateFields.success) {
			return { error: "Invalid fields" };
		}

		const { emails } = validateFields.data;
		const arrEmails: string[] = emails
			.split(",")
			.map((email) => email.trim())
			.filter((email) => email !== "");

		if (arrEmails.length === 0) {
			return { error: "No valid emails provided" };
		}

		await db.user.createMany({
			data: arrEmails.map((email) => ({ email })),
			skipDuplicates: true,
		});

		return null;
	} catch (error) {
		console.error("Error creating users:", error);
		return { error: "Internal server error" };
	}
};
