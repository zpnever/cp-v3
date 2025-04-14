import { Queue } from "bullmq";
import { redis } from "../redis";

export const submissionTestQueue = new Queue("submissionQueue", {
	connection: redis,
});
