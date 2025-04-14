"use client";

import { useState } from "react";
import FormVerifyEmail from "@/components/auth/form-verify-email";
import FormOTPVerify from "@/components/auth/form-verify-otp";
import toast from "react-hot-toast";
import FormRegister from "@/components/auth/form-register";

const VerifyPage = () => {
	const [step, setStep] = useState(1);
	const [email, setEmail] = useState("");

	return (
		<div className="flex justify-center items-center h-[90vh]">
			{step === 1 ? (
				<FormVerifyEmail
					onSuccess={() => {
						setStep(2);
						toast.success("OTP Send to your email", { removeDelay: 2000 });
					}}
					onSetEmail={(e) => setEmail(e)}
				/>
			) : step === 2 ? (
				<FormOTPVerify
					email={email}
					onResendOTP={() => {
						toast.success("OTP has been resend to your email", {
							removeDelay: 2000,
						});
					}}
					onSuccess={() => {
						toast.success("Successfully verified OTP", { removeDelay: 2000 });
						setStep(3);
					}}
				/>
			) : (
				// <FormRegister email={email} />
				<FormRegister
					email={email}
					onSuccess={() => {
						toast.success("Successfully register", { removeDelay: 2000 });
					}}
				/>
			)}
		</div>
	);
};

export default VerifyPage;
