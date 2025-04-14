import { TriangleAlertIcon } from "lucide-react";

interface FormErrorProps {
	message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
	if (!message) return null;
	return (
		<div className="bg-destructive/15 font-poppins p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
			<TriangleAlertIcon />
			<p>{message}</p>
		</div>
	);
};

export default FormError;
