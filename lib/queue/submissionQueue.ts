import { Queue } from "bullmq";
import { redis } from "../redis";

export type TestCase = {
	input: string;
	output: string;
};

export type SubmissionPayload = {
	teamId: string;
	contestId: string;
	code: string;
	functionName: string;
	languageId: string;
	problemId: string;
	userId: string;
	testCases: TestCase[];
};

export const submissionQueue = new Queue<SubmissionPayload>(
	"submissionProblem",
	{
		connection: redis,
	}
);
