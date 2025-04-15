"use server";

import * as z from "zod";
import { LoginSchema } from "@/lib/zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validateFields = LoginSchema.safeParse(values);
	if (!validateFields.success) return { error: "Invalid fields" };

	const { email, password } = validateFields.data;

	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		return { success: true };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid Email or Password" };
				default:
					return { error: "Something went wrong!" };
			}
		}
	}
};
