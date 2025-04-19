import * as React from "react";

interface EmailOTPTemplateProps {
	otp: string;
}

export const ResendEmailOTP: React.FC<Readonly<EmailOTPTemplateProps>> = ({
	otp,
}) => (
	<div
		style={{
			fontFamily: "Arial, sans-serif",
			backgroundColor: "#f9f9f9",
			padding: "30px",
		}}
	>
		<div
			style={{
				maxWidth: "600px",
				margin: "0 auto",
				backgroundColor: "#ffffff",
				padding: "40px",
				borderRadius: "8px",
				boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
			}}
		>
			<h2 style={{ color: "#333333", textAlign: "center" }}>
				Your One-Time Password (OTP)
			</h2>
			<p style={{ color: "#555555", fontSize: "16px" }}>
				Use the OTP below to complete your verification process. This code is
				valid for 5 minutes.
			</p>
			<div
				style={{
					fontSize: "32px",
					fontWeight: "bold",
					color: "#4F46E5",
					textAlign: "center",
					letterSpacing: "8px",
					margin: "30px 0",
				}}
			>
				{otp}
			</div>
			<p style={{ color: "#999999", fontSize: "14px" }}>
				If you did not request this code, please ignore this email.
			</p>
			<hr
				style={{
					border: "none",
					borderTop: "1px solid #e0e0e0",
					margin: "30px 0",
				}}
			/>
			<p style={{ fontSize: "12px", color: "#bbbbbb", textAlign: "center" }}>
				&copy; {new Date().getFullYear()} Inacomp. All rights reserved.
			</p>
		</div>
	</div>
);
