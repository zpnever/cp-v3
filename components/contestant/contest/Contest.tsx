"use client";

import { Batch, Submission } from "@/lib/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import ContestProblem from "./ContestProblem";
import { useRouter } from "next/navigation";
import { Check, RefreshCw } from "lucide-react";
import CountdownTimer from "./ui/CountdownTimer";

interface IProps {
	userId: string | undefined;
	teamId: string | undefined;
	contestId: string;
}

interface ILockedProblem {
	userId: string;
	problemId: string;
}

const Contest = ({ userId, teamId, contestId }: IProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [batch, setBatch] = useState<Batch>();
	const [problemId, setProblemId] = useState("");
	const [stepProblem, setStepProblem] = useState(false);
	const [submission, setSubmission] = useState<Submission>();
	const [lockedProblem, setLockedProblem] = useState<ILockedProblem[]>();
	const [finishedUsers, setFinishedUsers] = useState<string[]>([]);
	const [isUserFinished, setIsUserFinished] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const getContestData = async () => {
			const res = await fetch(`/api/contest/${teamId}/${contestId}`);
			const json = await res.json();

			if (!res.ok) {
				toast.error(json.message);
				return;
			}

			setBatch(json.data.batch);
			setSubmission(json.data.submission);
			setIsLoading(false);
		};

		getContestData();
	}, [teamId, contestId, stepProblem]);

	useEffect(() => {
		const getLockedProblem = async () => {
			const res = await fetch(`/api/locked-problem/${contestId}/${teamId}`);
			const json = await res.json();

			if (!res.ok) {
				toast.error("Something Error");
			}

			const locked: ILockedProblem[] = json.lockedProblem;
			setLockedProblem(locked);

			const userLocked = locked.find((lock) => lock.userId === userId);

			if (userLocked && !stepProblem) {
				toast("Kamu masih mengerjakan soal yang sama, mengalihkan...");
				setProblemId(userLocked.problemId);
				setStepProblem(true);
			}
		};

		getLockedProblem();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [teamId, contestId, userId]);

	// locked check
	useEffect(() => {
		if (!stepProblem) {
			const interval = setInterval(() => {
				fetch(`/api/locked-problem/${contestId}/${teamId}`)
					.then((res) => res.json())
					.then((json) => {
						if (json.lockedProblem) {
							setLockedProblem(json.lockedProblem);
						}
					})
					.catch(() => {
						toast.error("Gagal refresh data soal terkunci");
					});
			}, 10000); // 10 detik

			return () => clearInterval(interval);
		}
	}, [stepProblem, contestId, teamId]);

	// Finish check
	useEffect(() => {
		if (!stepProblem) {
			const interval = setInterval(async () => {
				const res = await fetch(
					`/api/finish?contestId=${contestId}&teamId=${teamId}`
				);
				const data = await res.json();
				setFinishedUsers(data.finished);

				if (data.finished.includes(userId || "")) {
					setIsUserFinished(true);
				} else {
					setIsUserFinished(false);
				}

				if (data.finished.length === 2) {
					router.push("/batch");
				}
			}, 10000);

			return () => clearInterval(interval);
		}
	}, [contestId, teamId, stepProblem, router, userId]);

	const handleKerjakan = async (problemId: string) => {
		const reqBody = {
			contestId,
			teamId,
			problemId,
			userId,
		};

		const res = await fetch(`/api/locked-problem`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reqBody),
		});

		setProblemId(problemId);
		setStepProblem(true);
	};

	const handleAutoSubmit = async () => {
		const reqBody = { contestId, teamId };

		const res = await fetch(`/api/finish/auto-submit`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reqBody),
		});

		router.push("/batch");
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
				<RefreshCw className="h-8 w-8 animate-spin text-gray-500 mb-4" />
				<h3 className="text-lg font-medium">Loading...</h3>
			</div>
		);
	}

	return (
		<div>
			{/* Step for problem */}
			{stepProblem && (
				<div className="absolute h-screen w-full">
					<ContestProblem
						startedAt={
							batch?.startedAt ? new Date(batch.startedAt) : new Date()
						}
						duration={batch?.timer || 0}
						onFinish={handleAutoSubmit}
						contestId={contestId}
						problemId={problemId}
						userId={userId}
						teamId={teamId}
						stepProblem={stepProblem}
						onBack={() => setStepProblem(false)}
					/>
				</div>
			)}

			<section className="flex flex-row justify-between items-center bg-white p-4 mx-6 rounded-b-lg shadow-lg">
				<div className="flex flex-row gap-4">
					<div className="border-r-1 border-gray-400 pr-4">
						<h1>{batch?.title}</h1>
					</div>
					<div>
						{" "}
						<CountdownTimer
							startedAt={
								batch?.startedAt ? new Date(batch.startedAt) : new Date()
							} // Konversi explisit ke Date
							durationMinutes={batch?.timer || 0}
							onFinish={handleAutoSubmit}
						/>
					</div>
				</div>
				<div>
					<div className="flex items-center gap-4">
						{isUserFinished && finishedUsers.length < 2 && (
							<span className="text-sm text-muted-foreground">
								Menunggu anggota lain...
							</span>
						)}
						{isUserFinished ? (
							<Button
								variant="outline"
								onClick={async () => {
									await fetch("/api/finish", {
										method: "DELETE",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({ contestId, teamId, userId }),
									});
									setIsUserFinished(false);
								}}
							>
								Batalkan
							</Button>
						) : (
							<Button
								onClick={async () => {
									await fetch("/api/finish", {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											contestId,
											teamId,
											userId,
											totalMember: 2,
										}),
									});
									setIsUserFinished(true);
								}}
							>
								Finish
							</Button>
						)}
					</div>
				</div>
			</section>

			<div className="grid grid-cols-1 mx-6 my-6 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{batch?.problems?.map((prob) => {
					const isLockedByOthers = lockedProblem?.some(
						(lock) => lock.problemId === prob.id && lock.userId !== userId
					);

					const isSuccess = submission?.submissionProblems?.some(
						(sp) => sp.problemId === prob.id
					);

					return (
						<div
							key={prob.id}
							className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
								isSuccess
									? "border-green-200 bg-green-50"
									: "border-gray-200 bg-white"
							}`}
						>
							<div className="p-5 flex justify-between items-center border-b border-gray-100">
								<h3 className="font-medium text-lg text-gray-800">
									{prob.title}
								</h3>
								{isSuccess && (
									<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
										<Check size={14} className="mr-1" /> Selesai
									</span>
								)}
							</div>
							<div className="p-5">
								<button
									onClick={() => !isLockedByOthers && handleKerjakan(prob.id)}
									disabled={isLockedByOthers}
									className={`w-full py-2 px-4 rounded-md transition-colors ${
										isLockedByOthers
											? "bg-gray-100 text-gray-500 cursor-not-allowed"
											: "bg-blue-600 hover:bg-blue-700 text-white"
									}`}
								>
									{isLockedByOthers
										? "Sedang dikerjakan oleh anggota lain"
										: "Kerjakan"}
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Contest;
