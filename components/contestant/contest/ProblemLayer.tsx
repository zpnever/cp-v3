import { RichTextRenderer } from "@/components/batch-form/ui/RichTextRenderer";
import { Problem } from "@/lib/types";

const ProblemLayer = ({ problem }: { problem: Problem }) => {
	return (
		<div className="">
			<RichTextRenderer description={problem.description!} />
		</div>
	);
};

export default ProblemLayer;
