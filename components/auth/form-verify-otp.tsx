"use client";

import { useState, useTransition } from "react";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import FormError from "@/components/auth/ui/form-error";
import CountdownOTP from "@/components/ui/countdown-otp";
import { verifyOTP } from "@/actions/register";

const FormOTPVerify = ({
	email,
	onSuccess,
	onResendOTP,
}: {
	email: string;
	onSuccess: () => void;
	onResendOTP: () => void;
}) => {
	const [otp, setOtp] = useState("");
	const [message, setMessage] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const submitOTP = async () => {
		setMessage("");
		startTransition(() => {
			verifyOTP(otp, email).then((data) => {
				if (data?.error) {
					setMessage(data.error);
				} else {
					onSuccess();
				}
			});
		});
	};

	return (
		<form
			action={submitOTP}
			className="bg-white scale-90 items-center rounded-3xl shadow-xl border-4 border-gray-800 p-8 max-w-md w-full flex flex-col overflow-hidden"
			style={{ boxShadow: "8px 8px 0 rgba(0,0,0,1)" }}
		>
			<h1 className="text-center font-poppins font-bold text-2xl mb-8">
				VERIFY OTP
			</h1>

			{/* OTP Field */}
			<div className="space-y-4 flex mb-4">
				<InputOTP
					maxLength={6}
					value={otp}
					disabled={isPending}
					onChange={setOtp}
				>
					<InputOTPGroup>
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
					</InputOTPGroup>
				</InputOTP>
				<input type="hidden" name="otp" value={otp} />
			</div>

			{/* Error message */}
			<FormError message={message} />

			<Button
				type="submit"
				className="cursor-pointer mt-4"
				disabled={isPending}
			>
				Verify OTP
			</Button>

			<div className="relative mt-4">
				<CountdownOTP
					email={email}
					onResendOTP={() => {
						onResendOTP();
					}}
				/>
			</div>
		</form>
	);
};

export default FormOTPVerify;
