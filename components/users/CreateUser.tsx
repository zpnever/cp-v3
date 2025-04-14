"use client";

import { createUser } from "@/actions/createUser";
import { CreateUserSchema, FormCreateUserType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form } from "@/components/ui/form";

const CreateUser = ({ onClose }: { onClose: () => void }) => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<FormCreateUserType>({
		resolver: zodResolver(CreateUserSchema),
		defaultValues: {
			emails: "",
		},
	});

	const onSubmit = async (values: FormCreateUserType) => {
		startTransition(() => {
			createUser(values).then((data) => {
				if (data?.error) {
					toast.error(data.error);
				} else {
					toast.success("Successfully created user");
					form.reset();
				}
			});
		});
	};

	return (
		<div className="max-w-3xl mx-auto bg-white border relative border-neutral-200 rounded-lg p-8 shadow-sm">
			<Button
				onClick={onClose}
				variant="ghost"
				size="icon"
				className="absolute top-3 right-3 h-10 w-10 cursor-pointer"
			>
				<X size={18} />
			</Button>
			<h1 className="text-center font-poppins font-bold text-2xl mb-8">
				Create User Account
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					{/* Emails Field */}
					<FormField
						control={form.control}
						name="emails"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-poppins">Input Email</FormLabel>
								<FormControl>
									<Input placeholder="Input email here" {...field} />
								</FormControl>
								<FormDescription>
									You can write like : example1@gmail.com, example2@gmail.com,
									etc.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<Button
						type="submit"
						disabled={isPending}
						className="font-poppins cursor-pointer"
					>
						{isPending ? "Submitting..." : "Submit"}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default CreateUser;
