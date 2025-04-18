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
import toast from "react-hot-toast";

const AlertDisqualified = ({ teamIds }: { teamIds: string[] }) => {
	const handleDisqualifiedTeam = (teamIds: string[]) => {
		fetch(`/api/disqualified`, {
			method: "POST",
			body: JSON.stringify({ teamIds }),
		})
			.then((res) => res.json())
			.then((json) => {
				toast.success(json.message || "Teams successfully disqualified");
			})
			.catch((error) => {
				console.error("Failed to disqualified team:", error);
				toast.error("Failed to disqualified team");
			});
	};

	return (
		<div>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="default"
						disabled={teamIds.length === 0}
						title="Disqualified Team"
						className={
							teamIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
						}
					>
						Disqualify Selected Teams ({teamIds.length})
					</Button>
				</AlertDialogTrigger>

				{/* Delete Confirmation Dialog */}
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Disqualified Team</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to disqualified team?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => teamIds && handleDisqualifiedTeam(teamIds)}
							className="bg-black hover:bg-gray-800"
						>
							Disqualified
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default AlertDisqualified;
