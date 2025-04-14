"use client";

import * as z from "zod";
import { LoginSchema } from "@/lib/zod";
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
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const FormLogin = () => {
	const [isPending, startTransition] = useTransition();
	const [errorMessage, setErrorMessage] = useState<string | undefined>("");
	const router = useRouter();

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
		setErrorMessage("");

		const data = await login(values);

		if (data?.error) {
			setErrorMessage(data.error);
			return;
		}

		router.push("/admin/batch");
	};

	return (
		<div
			className="bg-white scale-90 rounded-3xl shadow-xl border-4 border-gray-800 p-8 max-w-md w-full relative overflow-hidden"
			style={{
				boxShadow: "8px 8px 0 rgba(0,0,0,1)",
			}}
		>
			<h1 className="text-center font-poppins font-bold text-2xl mb-8">
				LOGIN
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

					{/* Password Field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-poppins">Password</FormLabel>
								<FormControl>
									<Input
										placeholder="*********"
										className="font-poppins"
										type="password"
										disabled={isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage className="font-poppins" />
							</FormItem>
						)}
					/>

					{/* Message From BE */}
					<FormError message={errorMessage} />

					{/* Lupa Password */}
					<div className="flex justify-end">
						<Link href="/forgot-password">
							<span className="text-sm text-blue-700 hover:text-black font-medium font-poppins">
								Forgot Password?
							</span>
						</Link>
					</div>

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
					Not yet registered?
				</p>
				<Link href="/register">
					<span className="text-sm text-blue-700 hover:text-black font-medium font-poppins">
						Register here
					</span>
				</Link>
			</div>
		</div>
	);
};

export default FormLogin;
