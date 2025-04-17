import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Bird } from "lucide-react";
import toast from "react-hot-toast";

const AlertSubmitBatch = ({
	pending,
	batchId,
}: {
	pending: boolean;
	batchId: string;
}) => {
	const handleSubmitBatch = (id: string) => {
		fetch(`/api/finish/batch-admin`, {
			method: "POST",
			body: JSON.stringify({ batchId: id }),
		})
			.then((res) => res.json())
			.then((json) => {
				toast.success(json.message || "Batch submit successfully");
			})
			.catch((error) => {
				console.error("Failed to Submit batch:", error);
				toast.error("Failed to Submit batch");
			});
	};

	return (
		<div>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						disabled={pending}
						variant="default"
						title="Submit Batch"
						size="icon"
						className="w-32 cursor-pointer"
						onClick={() => batchId}
					>
						<Bird size={16} />
						<p>Submit Batch</p>
					</Button>
				</AlertDialogTrigger>

				{/* Delete Confirmation Dialog */}
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Submit Batch</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to submit this contest batch?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => batchId && handleSubmitBatch(batchId)}
							className="bg-black hover:bg-gray-800"
						>
							Submit
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default AlertSubmitBatch;
