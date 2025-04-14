import { auth } from "@/auth";
import CardBatchContest from "@/components/contestant/contest/CardBatchContest";

const BatchPage = async () => {
	const session = await auth();
	const teamId = session?.user?.teamId;

	return (
		<div className="py-10 px-20">
			<CardBatchContest teamId={teamId!} />
		</div>
	);
};

export default BatchPage;
