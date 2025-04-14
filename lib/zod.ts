import { object, string } from "zod";
import * as z from "zod";

//AUTH SCHEMA
export const LoginSchema = object({
	email: string().min(1, "Email is required").email("Invalid Email"),
	password: string().min(8, "Password is required"),
});

export const ResetPasswordSchema = object({
	email: string().min(1, "Email is required").email("Invalid Email"),
});
export const NewPasswordSchema = object({
	password: string()
		.min(8, "Password must be more than 8 char")
		.max(32, "Password must be less than 8 char"),
	confirmPassword: string()
		.min(8, "Password must be more than 8 char")
		.max(32, "Password must be less than 8 char"),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Password does not match",
	path: ["confirmPassword"],
});

export const VerifyEmailSchema = object({
	email: string().min(1, "Email is required").email("Invalid Email"),
});

export const VerifyOTPSchema = object({
	email: string().min(1, "Email is required").email("Invalid Email"),
	otp: string().min(1, "OTP is required").max(6, "OTP is Invalid"),
});

export const RegisterSchema = object({
	email: string().email("Invalid Email").min(1, "Email is required"),
	password: string()
		.min(8, "Password must be more than 8 char")
		.max(32, "Password must be less than 8 char"),
	confirmPassword: string()
		.min(8, "Password must be more than 8 char")
		.max(32, "Password must be less than 8 char"),
	name: string().min(1, "Nama Lengkap is required"),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Password does not match",
	path: ["confirmPassword"],
});

//BATCH SCHEMA
export const LanguageSchema = z.object({
	name: z.string(),
	functionTemplate: z.string().min(1, "functionTemplate is required"),
	languageId: z.number(),
});

export const TestCaseSchema = z.object({
	input: z.string().min(1, "Input is required"),
	output: z.string().min(1, "Output is required"),
});

export const ProblemSchema = z.object({
	title: z.string().min(1, "Problem title is required"),
	description: z.string().min(1, "Problem description is required"),
	functionExecution: z.string().min(1, "Function execution is required"),
	languages: z.array(LanguageSchema).min(1),
	testCases: z.array(TestCaseSchema).min(1, "Test case is required"),
});

export const BatchSchema = z.object({
	title: z.string().min(1, "Batch title is required"),
	description: z.string().min(1, "Batch description is required"),
	timer: z
		.string()
		.refine((val) => !isNaN(parseInt(val)), "Timer must be a number"),
	publish: z.boolean().default(false),
	startedAt: z.string().refine(
		(val) => {
			try {
				new Date(val);
				return true;
			} catch {
				return false;
			}
		},
		{ message: "Invalid datetime format" }
	),
	problems: z.array(ProblemSchema).min(1, "Problem is required"),
});

export type FormBatchType = z.infer<typeof BatchSchema>;
export type FormProblemType = z.infer<typeof ProblemSchema>;

// USERS SCHEMA
export const CreateUserSchema = z.object({
	emails: z.string().min(1, "Email is required"),
});

export const CreateTeamSchema = z.object({
	name: z.string().min(1, "Name is required"),
});

export type FormCreateUserType = z.infer<typeof CreateUserSchema>;
export type FormCreateTeamType = z.infer<typeof CreateTeamSchema>;
