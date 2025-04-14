"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/auth/ui/form-error";
import { VerifyEmailSchema } from "@/lib/zod";
import { verifyEmail } from "@/actions/register";

const FormVerifyEmail = ({
	onSuccess,
	onSetEmail,
}: {
	onSuccess: () => void;
	onSetEmail: (email: string) => void;
}) => {
	const [erroMessage, setErrorMessage] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof VerifyEmailSchema>>({
		resolver: zodResolver(VerifyEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof VerifyEmailSchema>) => {
		setErrorMessage("");
		startTransition(() => {
			verifyEmail(values).then((data) => {
				if (data?.error) {
					setErrorMessage(data.error);
				} else {
					onSuccess();
					onSetEmail(values.email);
				}
			});
		});
	};

	return (
		<div
			className="bg-white scale-90 rounded-3xl shadow-xl border-4 border-gray-800 p-8 max-w-md w-full relative overflow-hidden"
			style={{ boxShadow: "8px 8px 0 rgba(0,0,0,1)" }}
		>
			<h1 className="text-center font-poppins font-bold text-2xl mb-8">
				VERIFY EMAIL
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					{/* Email Field */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-poppins">Email</FormLabel>
								<FormControl>
									<Input
										disabled={isPending}
										placeholder="example@example.com"
										className="font-poppins"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Message From BE */}
					<FormError message={erroMessage} />

					{/* Submit Button */}
					<Button
						type="submit"
						disabled={isPending}
						className="font-poppins cursor-pointer"
					>
						Submit
					</Button>

					{/* Login */}
					<div className="flex justify-end">
						<Link href="/login">
							<span className="text-sm text-blue-700 hover:text-black font-medium font-poppins">
								Already have an account?
							</span>
						</Link>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default FormVerifyEmail;
