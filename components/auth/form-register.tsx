"use client";

import { useState, useEffect, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
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
import { RegisterSchema } from "@/lib/zod";
import { registerData } from "@/actions/register";

// EMAIL FORM
const FormRegister = ({
	email,
	onSuccess,
}: {
	email: string;
	onSuccess: () => void;
}) => {
	const router = useRouter();
	const [message, setMessage] = useState("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
		setMessage("");
		startTransition(() => {
			registerData(values).then((data) => {
				if (data?.error) {
					setMessage(data.error);
				} else {
					onSuccess();
					router.push("/login");
				}
			});
		});
	};

	// Tambahkan useEffect
	useEffect(() => {
		form.setValue("email", email);
	}, [email, form]);

	return (
		<div
			className="bg-white scale-90 rounded-3xl shadow-xl border-4 border-gray-800 p-8 max-w-md w-full relative overflow-hidden"
			style={{ boxShadow: "8px 8px 0 rgba(0,0,0,1)" }}
		>
			<h1 className="text-center font-poppins font-bold text-2xl mb-8">
				REGISTER
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					{/* Name Field */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-poppins">Nama Lengkap</FormLabel>
								<FormControl>
									<Input
										disabled={isPending}
										placeholder=""
										className="font-poppins"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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

					{/* Password Field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-poppins">Password</FormLabel>
								<FormControl>
									<Input
										disabled={isPending}
										placeholder="********"
										className="font-poppins"
										{...field}
										type="password"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Confirm Password Field */}
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-poppins">Confirm Password</FormLabel>
								<FormControl>
									<Input
										disabled={isPending}
										placeholder="********"
										className="font-poppins"
										{...field}
										type="password"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Message From BE */}
					<FormError message={message} />

					{/* Submit Button */}
					<Button
						type="submit"
						disabled={isPending}
						className="font-poppins cursor-pointer"
					>
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default FormRegister;
