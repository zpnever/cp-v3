export function getScore({
	solvedCount,
	totalProblems,
	executionTimes,
	memoryUsages,
	completionTime,
	maxCompletionTime = 3600, // default: 1 jam
	defaultExecutionTime = 1, // default: 2 detik
	defaultMemoryUsage = 10240, // default: 10240 KB
}: {
	solvedCount: number;
	totalProblems: number;
	executionTimes: (number | null)[];
	memoryUsages: (number | null)[];
	completionTime: number;
	maxCompletionTime?: number;
	defaultExecutionTime?: number;
	defaultMemoryUsage?: number;
}) {
	const fixedExec = fillMissing(
		executionTimes,
		totalProblems,
		defaultExecutionTime
	);
	const fixedMem = fillMissing(memoryUsages, totalProblems, defaultMemoryUsage);

	const avgExec = average(fixedExec);
	const avgMem = average(fixedMem);

	const problemScore = (solvedCount / totalProblems) * 60;

	const execScore = Math.max((1 - avgExec / defaultExecutionTime) * 12.5, 0);
	const memScore = Math.max((1 - avgMem / 1024) * 12.5, 0); // bisa sesuaikan baseline KB
	const compScore = Math.max((1 - completionTime / maxCompletionTime) * 15, 0);

	const totalScore = problemScore + execScore + memScore + compScore;

	return round(Math.max(totalScore, 0));
}

function fillMissing(
	arr: (number | null)[],
	total: number,
	fallback: number
): number[] {
	const filled = arr.map((v) => (v == null ? fallback : v));
	while (filled.length < total) {
		filled.push(fallback);
	}
	return filled;
}

function average(arr: number[]): number {
	return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

function round(n: number): number {
	return Math.round(n * 100) / 100;
}
