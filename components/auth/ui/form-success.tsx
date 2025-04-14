import { CircleCheck } from "lucide-react";

interface FormSuccessProps {
	message?: string;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
	if (!message) return null;
	return (
		<div className="bg-green-600/15 font-poppins p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600">
			<CircleCheck />
			<p>{message}</p>
		</div>
	);
};

export default FormSuccess;
