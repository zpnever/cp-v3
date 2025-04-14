import { Queue } from "bullmq";
import { redis } from "../redis";

export const autoSubmitQueue = new Queue("auto-submit", {
	connection: redis,
});
