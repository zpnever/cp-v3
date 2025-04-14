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
import { Trash } from "lucide-react";
import React, { TransitionEvent } from "react";
import toast from "react-hot-toast";

const AlertDeleteBatch = ({
	pending,
	fetchBatches,
	batchId,
}: {
	pending: boolean;
	fetchBatches: () => void;
	batchId: string;
}) => {
	const handleDelete = (id: string) => {
		fetch(`/api/batch/${id}/edit/`, {
			method: "DELETE",
		})
			.then((res) => res.json())
			.then((json) => {
				toast.success(json.message || "Batch deleted successfully");
				fetchBatches();
			})
			.catch((error) => {
				console.error("Failed to delete batch:", error);
				toast.error("Failed to delete batch");
			});
	};

	return (
		<div>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						disabled={pending}
						variant="destructive"
						title="Delete Batch"
						size="icon"
						className="w-32 cursor-pointer"
						onClick={() => batchId}
					>
						<Trash size={16} />
						<p>Delete Batch</p>
					</Button>
				</AlertDialogTrigger>

				{/* Delete Confirmation Dialog */}
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove Batch</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to permanently remove this batch? This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => batchId && handleDelete(batchId)}
							className="bg-red-600 hover:bg-red-800"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default AlertDeleteBatch;
