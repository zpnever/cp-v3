"use server";

import * as z from "zod";
import { NewPasswordSchema, ResetPasswordSchema } from "@/lib/zod";
import { getUserByEmail } from "./user";
import { Resend } from "resend";
import { generatePasswordResetToken } from "@/lib/token";
import { db } from "@/lib/db";
import { hash } from "bcrypt-ts";
import { ResendEmailReset } from "@/components/email/send/ResendTemplate";
import React from "react";

export const sendResetToken = async (
	values: z.infer<typeof ResetPasswordSchema>
) => {
	const validatedFields = ResetPasswordSchema.safeParse(values);

	if (!validatedFields.success) return { error: "Invalid fields" };

	const { email } = validatedFields.data;

	const user = await getUserByEmail(email);

	if (!user) return { error: "Email is not found" };
	if (!user.isVerified || !user.password)
		return { error: "Your account is not registered" };

	const passwordResetToken = await generatePasswordResetToken(email);

	sendResetTokenEmail(passwordResetToken.email, passwordResetToken.token);

	return { success: "Success sending link to your email" };
};

// async function sendResetTokenEmail(email: string, token: string) {
// 	const resetLink = `${process.env.NEXT_PUBLIC_API_URL}/new-password?token=${token}`;
// 	const transporter = createTransport({
// 		service: "gmail",
// 		auth: {
// 			user: "competitiveprogramming06@gmail.com",
// 			pass: "jrez fifb sicz vsxh",
// 		},
// 	});

// 	await transporter.sendMail({
// 		from: `competitiveprogramming06@gmail.com`,
// 		to: email,
// 		subject: "Password Reset",
// 		html: `<p>Click <a href="${resetLink}">here</a> to reset your password</br> <p>expires in 1 hour</p>`,
// 	});
// }

async function sendResetTokenEmail(email: string, token: string) {
	const resend = new Resend(process.env.RESEND_API_KEY);
	const resetLink = `${process.env.NEXT_PUBLIC_API_URL}/new-password?token=${token}`;

	await resend.emails.send({
		from: "CP Inacomp <send@inacomp.site>",
		to: [email],
		subject: "Reset Password",
		react: React.createElement(ResendEmailReset, { resetLink }),
	});
}

export const newPassword = async (
	values: z.infer<typeof NewPasswordSchema>,
	token?: string | null
) => {
	if (!token) return { error: "Missing token!" };

	const validatedFields = NewPasswordSchema.safeParse(values);

	if (!validatedFields.success) return { error: "Invalid validated fields" };

	const { password } = validatedFields.data;

	const existingToken = await db.passwordResetToken.findUnique({
		where: {
			token,
		},
	});

	if (!existingToken) return { error: "Invalid token!" };

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) return { error: "Token has expired" };

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) return { error: "Email does not exist!" };

	const hashedPassword = await hash(password, 10);

	await db.user.update({
		where: {
			id: existingUser.id,
		},
		data: {
			password: hashedPassword,
		},
	});

	await db.passwordResetToken.delete({
		where: {
			id: existingToken.id,
		},
	});

	return { success: "Success reset password" };
};
