"use client";

import * as z from "zod";
import { ResetPasswordSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import Link from "next/link";
import FormError from "@/components/auth/ui/form-error";
import { useState, useTransition } from "react";
  import { sendResetToken } from "@/actions/reset";
import FormSuccess from "./ui/form-success";

const FormResetPassword = () => {
	const [isPending, startTransition] = useTransition();
	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);
	const [successMessage, setSuccessMessage] = useState<string | undefined>(
		undefined
	);

	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
		setErrorMessage("");
		startTransition(() => {
			sendResetToken(values).then((data) => {
				if (data?.error) {
					setErrorMessage(data.error);
				}
				setSuccessMessage(data.success);
			});
		});
	};

	return (
		<div
			className="bg-white scale-90 rounded-3xl shadow-xl border-4 border-gray-800 p-8 max-w-md w-full relative overflow-hidden"
			style={{
				boxShadow: "8px 8px 0 rgba(0,0,0,1)",
			}}
		>
			<h1 className="text-center font-poppins font-bold text-2xl mb-8">
				RESET PASSWORD
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
										placeholder="example@example.com"
										className="font-poppins"
										{...field}
										disabled={isPending}
									/>
								</FormControl>
								<FormMessage className="font-poppins" />
							</FormItem>
						)}
					/>

					{/* Message From BE */}
					<FormSuccess message={successMessage} />
					<FormError message={errorMessage} />

					{/* Submit Button */}
					<Button
						disabled={isPending}
						type="submit"
						className="font-poppins cursor-pointer"
					>
						Submit
					</Button>
				</form>
			</Form>

			{/* Register Section */}
			<div className="flex mt-4 gap-1 items-center">
				<p className="font-poppins text-sm text-gray-500 font-medium ">
					Already remember password?
				</p>
				<Link href="/login">
					<span className="text-sm text-blue-700 hover:text-black font-medium font-poppins">
						Back to login
					</span>
				</Link>
			</div>
		</div>
	);
};

export default FormResetPassword;
