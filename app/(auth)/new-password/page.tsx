"use client";

import FormNewPassword from "@/components/auth/form-new-password";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const NewPasswordContent = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	if (!token) {
		redirect("/login");
	}

	return <FormNewPassword />;
};

const NewPassword = () => {
	return (
		<div className="flex justify-center items-center h-[90vh]">
			<Suspense fallback={<p>Loading...</p>}>
				<NewPasswordContent />
			</Suspense>
		</div>
	);
};

export default NewPassword;
