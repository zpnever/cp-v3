"use client";

import { resendOTP } from "@/actions/register";
import { useState, useEffect } from "react";

const CountdownOTP = ({
	initialTime = 10,
	email,
	onResendOTP,
}: {
	initialTime?: number;
	email: string;
	onResendOTP: () => void;
}) => {
	const [timeLeft, setTimeLeft] = useState(initialTime);
	const [step, setStep] = useState(1);

	useEffect(() => {
		if (timeLeft <= 0) return;

		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000); 

		return () => clearInterval(interval);
	}, [timeLeft]);

	const handleClick = async () => {
		resendOTP(email).then((data) => {
			if (!data?.error) {
				setStep(2);
				onResendOTP();
			} else {
				alert(data.error);
			}
		});
	};

	return (
		<>
			{step === 1 ? (
				<div className="flex justify-center">
					{timeLeft <= 0 ? (
						<span
							onClick={handleClick}
							className="text-sm text-blue-700 hover:text-black font-medium cursor-pointer font-poppins"
						>
							Resend OTP
						</span>
					) : (
						<span className="text-sm text-gray-500 font-medium font-poppins">
							Resend OTP, {timeLeft} second
						</span>
					)}
				</div>
			) : (
				<div></div>
			)}
		</>
	);
};

export default CountdownOTP;
