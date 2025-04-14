import {
	AlertDialog,
	AlertDialogActionDelete,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import React from "react";

const PopupDelete = ({
	onDelete,
	pending,
	item,
}: {
	onDelete: (e: React.MouseEvent) => void | Promise<void>;
	pending?: boolean;
	item: string;
}) => {
	const handleDelete = async (e: React.MouseEvent) => {
		try {
			await onDelete(e);
		} catch (error) {
			console.error("Error deleting item:", error);
		}
	};

	return (
		<div className="">
			<AlertDialog>
				<AlertDialogTrigger
					disabled={pending}
					className="text-white scale-[90%] cursor-pointer font-md font-semibold flex py-2 px-4 rounded-md gap-1 items-center border bg-red-600 shadow-xs hover:bg-red-50 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
				>
					<Trash size={16} className="mr-2" />
					Remove {item}
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove {item}</AlertDialogTitle>
						<AlertDialogDescription>
							This will remove permanently {item}. Are you sure?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogActionDelete onClick={handleDelete}>
							Delete
						</AlertDialogActionDelete>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default PopupDelete;
