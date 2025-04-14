"use server";

import * as z from "zod";
import { VerifyEmailSchema, VerifyOTPSchema, RegisterSchema } from "@/lib/zod";
import { db } from "@/lib/db";
import speakeasy from "speakeasy";
import { createTransport } from "nodemailer";
import { hashSync } from "bcrypt-ts";

// VERIFY EMAIL
export const verifyEmail = async (
	values: z.infer<typeof VerifyEmailSchema>
) => {
	try {
		const validatedFields = VerifyEmailSchema.safeParse(values);

		if (!validatedFields.success) return { error: "Invalid fields" };

		const { email } = validatedFields.data;

		// User Existed Check
		const existedUser = await db.user.findUnique({ where: { email } });
		if (!existedUser) return { error: "User does not exist" };
		if (existedUser?.password) return { error: "User already registered" };

		// OTP
		const otp = speakeasy.totp({
			secret: speakeasy.generateSecret().base32,
			encoding: "base32",
			step: 300, // Berlaku 5 menit
		});

		await db.user.update({
			where: {
				email,
			},
			data: { otp },
		});

		sendOTPEmail(email, otp);

		return null;
	} catch (error) {
		console.log(error);
		return { error: "Invalid server Error" };
	}
};

// SEND OTP TO EMAIL FUNCTION
async function sendOTPEmail(email: string, otp: string) {
	const transporter = createTransport({
		service: "gmail",
		auth: {
			user: "competitiveprogramming06@gmail.com",
			pass: "jrez fifb sicz vsxh",
		},
	});

	await transporter.sendMail({
		from: `competitiveprogramming06@gmail.com`,
		to: email,
		subject: "Kode OTP Verifikasi",
		text: `Kode OTP Anda: ${otp}`,
	});
}

// VERIFY EMAIL
export const verifyOTP = async (otp: string, email: string) => {
	try {
		// Validate input Zod
		const parseResult = VerifyOTPSchema.safeParse({ email, otp });
		if (!parseResult.success) {
			return { error: "Invalid fields" };
		}

		if (parseResult.data.otp.length < 6)
			return { error: "OTP must be filled in" };

		// Check email
		const existedEmail = await db.user.findUnique({ where: { email } });
		if (!existedEmail) return { error: "Email is not found" };

		// Check OTP
		if (existedEmail.otp !== otp) {
			return { error: "OTP does not match" };
		}

		// Update user otp
		await db.user.update({
			where: { email },
			data: {
				isVerified: true,
				otp: null,
			},
		});

		return null;
	} catch (error) {
		console.log(error);
		return { error: "Invalid server Error" };
	}
};

// RESEND OTP
export const resendOTP = async (email: string) => {
	try {
		const validatedFields = VerifyEmailSchema.safeParse({ email });

		// Field Check
		if (!validatedFields.success) return { error: "Invalid fields" };

		const user = await db.user.findUnique({
			where: { email: validatedFields.data.email },
		});

		if (!user) return { error: "User not found" };

		// OTP
		const otp = speakeasy.totp({
			secret: speakeasy.generateSecret().base32,
			encoding: "base32",
			step: 300, // Berlaku 5 menit
		});

		await db.user.update({
			where: {
				email,
			},
			data: { otp },
		});

		sendOTPEmail(email, otp);

		return null;
	} catch (error) {
		console.log(error);
		return { error: "Invalid server Error" };
	}
};

// REGISTER
export const registerData = async (values: z.infer<typeof RegisterSchema>) => {
	try {
		const validatedFields = RegisterSchema.safeParse(values);

		if (!validatedFields.success) return { error: "Invalid fields" };

		const { email, password, name } = validatedFields.data;

		// User Existed Check
		const existedUser = await db.user.findUnique({ where: { email } });
		if (!existedUser) return { error: "User does not exist" };
		if (existedUser?.password) return { error: "User already registered" };

		// Hash Password
		const hashedPassword = hashSync(password, 10);

		await db.user.update({
			where: { email },
			data: {
				name,
				password: hashedPassword,
				email,
			},
		});

		return null;
	} catch (error) {
		console.log(error);
		return { error: "Invalid server error" };
	}
};
