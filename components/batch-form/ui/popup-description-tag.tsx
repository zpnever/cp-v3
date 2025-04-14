import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function PopupDescriptionTag() {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Custom Tag</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Custom Tag Description</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="">
					{
						"Use [code] for inline code, [block] for code blocks, [br] for line break, [space size=10] for spacing, [imageUpload src={}] for images."
					}
				</AlertDialogDescription>
				<AlertDialogDescription>{""}</AlertDialogDescription>
				<AlertDialogDescription>
					{"Hello world! [code]This is inline code[/code]"}
				</AlertDialogDescription>
				<AlertDialogDescription>
					{`
[block]
function example() {
  return "Hello";
}
[/block]`}
				</AlertDialogDescription>
				<AlertDialogDescription>{"[space size=30]"}</AlertDialogDescription>
				<AlertDialogDescription>
					{`[imageUpload src={https://example.com/image.jpg}]`}
				</AlertDialogDescription>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
