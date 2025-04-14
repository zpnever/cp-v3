import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export const submissionQueue = new Queue("submissionProblem", {
	connection: redis,
});
