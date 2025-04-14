import { create } from "zustand";

type LogType = "info" | "success" | "error";

interface LogEntry {
	message: string;
	type: LogType;
}

interface SubmissionState {
	logs: Record<string, LogEntry[]>;
	status: Record<string, "idle" | "success" | "failed">;

	addLog: (roomId: string, log: LogEntry) => void;
	setStatus: (roomId: string, status: "idle" | "success" | "failed") => void;
	resetLogs: (roomId: string) => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
	logs: {},
	status: {},

	addLog: (roomId, log) =>
		set((state) => ({
			logs: {
				...state.logs,
				[roomId]: [...(state.logs[roomId] || []), log],
			},
		})),

	setStatus: (roomId, newStatus) =>
		set((state) => ({
			status: {
				...state.status,
				[roomId]: newStatus,
			},
		})),

	resetLogs: (roomId) =>
		set((state) => ({
			logs: {
				...state.logs,
				[roomId]: [],
			},
			status: {
				...state.status,
				[roomId]: "idle",
			},
		})),
}));
