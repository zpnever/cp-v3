// Enums
export enum Role {
	ADMIN = "ADMIN",
	CONTESTANT = "CONTESTANT",
}

// Models
export interface User {
	id: string;
	name: string | null;
	email: string;
	password: string | null;
	teamId: string | null;
	otp: string | null;
	photo: string | null;
	isVerified: boolean;
	isDisqualified: boolean;
	role: Role;
	createdAt: Date;
	updatedAt: Date;
	submissions?: Submission[];
	Team?: Team | null;
}

export interface PasswordResetToken {
	id: string;
	email: string;
	token: string;
	expires: Date;
}

export interface Batch {
	id: string;
	title: string;
	description: string | null;
	publish: boolean;
	timer: number;
	startedAt: Date;
	createdAt: Date;
	updatedAt: Date;
	teams?: BatchTeam[];
	problems?: Problem[];
	submissions?: Submission[];
}

export interface Problem {
	id: string;
	title: string;
	description: string;
	batchId: string;
	createdAt: Date;
	updatedAt: Date;
	batch?: Batch;
	functionExecution: string;
	languages?: Language[];
	testCases?: TestCase[];
	submissionProblems?: SubmissionProblem[];
}

export interface Language {
	id: string;
	name: string;
	languageId: number;
	problemId: string;
	functionTemplate: string;
	createdAt: Date;
	updatedAt: Date;
	problem?: Problem;
}

export interface TestCase {
	id: string;
	input: string;
	output: string;
	problemId: string;
	createdAt: Date;
	updatedAt: Date;
	problem?: Problem;
}

export interface BatchTeam {
	id: string;
	batchId: string;
	teamId: string;
	createdAt: Date;
	updatedAt: Date;
	isStart: boolean;
	batch?: Batch;
	team?: Team;
}

export interface Submission {
	id: string;
	userId: string;
	teamId: string;
	batchId: string;
	isFinish: boolean;
	score: number;
	startAt: Date;
	submittedAt: Date | null;
	totalProblemsSolved: number;
	completionTime: string | null;
	user?: User;
	batch?: Batch;
	Team?: Team;
	submissionProblems?: SubmissionProblem[];
}

export interface SubmissionProblem {
	id: string;
	submissionId: string;
	problemId: string;
	languageId: number | null;
	success: boolean;
	code: string | null;
	executionTime: number | null;
	memory: number | null;
	submittedAt: Date;
	submission?: Submission;
	problem?: Problem;
}

export interface Team {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	isDisqualified: boolean;
	members?: User[];
	submissions?: Submission[];
	batches?: BatchTeam[];
}
