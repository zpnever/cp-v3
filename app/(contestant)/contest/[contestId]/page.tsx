import { auth } from "@/auth";
import Contest from "@/components/contestant/contest/Contest";

const ContestPage = async ({
	params,
}: {
	params: Promise<{ contestId: string }>;
}) => {
	const contestId = (await params).contestId;
	const session = await auth();

	return (
		<div>
			<Contest
				teamId={session?.user.teamId}
				userId={session?.user.id}
				contestId={contestId}
			/>
		</div>
	);
};

export default ContestPage;
