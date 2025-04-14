"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheckIcon } from "lucide-react";
import { useState, useEffect } from "react";

type SuccessAlertProps = {
	message: string;
};

export const SuccessAlert = ({ message }: SuccessAlertProps) => {
	const [show, setShow] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShow(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	if (!show) return null;

	return (
		<div className="absolute right-2 top-2">
			<Alert variant="success">
				<MailCheckIcon className="h-4 w-4 " />
				<AlertTitle>Success</AlertTitle>
				<AlertDescription>{message}</AlertDescription>
			</Alert>
		</div>
	);
};

export const ErrorAlert = (message: string) => {
	return (
		<Alert variant="default">
			<MailCheckIcon className="h-6 w-6" />
			<AlertTitle>Success</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	);
};
