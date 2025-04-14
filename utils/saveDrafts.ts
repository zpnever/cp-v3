// lib/saveDraft.ts
export const saveDraft = async ({
	userId,
	contestId,
	problemId,
	codeDraft,
}: {
	userId: string;
	contestId: string;
	problemId: string;
	codeDraft: Record<number, string>;
}) => {
	try {
		await fetch("/api/draft-code/redis", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId, contestId, problemId, codeDraft }),
		});
	} catch (err) {
		console.error("Failed to save draft:", err);
	}
};
