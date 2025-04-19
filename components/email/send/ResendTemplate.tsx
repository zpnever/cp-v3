import * as React from "react";

interface EmailTemplateProps {
	resetLink: string;
}

export const ResendEmailReset: React.FC<Readonly<EmailTemplateProps>> = ({
	resetLink,
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
				Reset Password Request
			</h2>
			<p style={{ color: "#555555", fontSize: "16px" }}>
				We received a request to reset your password. If this was you, click the
				button below to proceed:
			</p>
			<div style={{ textAlign: "center", margin: "30px 0" }}>
				<a
					href={resetLink}
					style={{
						backgroundColor: "#4F46E5",
						color: "#ffffff",
						padding: "12px 24px",
						borderRadius: "6px",
						textDecoration: "none",
						fontWeight: "bold",
						display: "inline-block",
					}}
				>
					Reset My Password
				</a>
			</div>
			<p style={{ color: "#999999", fontSize: "14px" }}>
				This link will expire in 1 hour. If you didn’t request a password reset,
				you can safely ignore this email.
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
