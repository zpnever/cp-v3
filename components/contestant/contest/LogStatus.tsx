"use client";

import { Button } from "@/components/ui/button";
import { useSubmissionStore } from "@/lib/zustand/logsStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, AlertCircle, FileText, X } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
	userId: string;
	problemId: string;
	onClose: () => void;
}

export default function LogStatus({ userId, problemId, onClose }: Props) {
	const roomId = `${userId}:${problemId}`;
	const store = useSubmissionStore();
	const logs = store.logs[roomId] ?? [];
	const status = store.status[roomId] ?? "idle";

	const getStatusIcon = () => {
		switch (status) {
			case "success":
				return <CheckCircle className="h-5 w-5 text-green-500" />;
			case "failed":
				return <XCircle className="h-5 w-5 text-red-500" />;
			default:
				return <AlertCircle className="h-5 w-5 text-gray-500" />;
		}
	};

	const getLogIcon = (type: string) => {
		switch (type) {
			case "success":
				return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
			case "error":
				return <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
			default:
				return <AlertCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />;
		}
	};

	const getStatusColor = () => {
		switch (status) {
			case "success":
				return "bg-green-100 text-green-800 hover:bg-green-200";
			case "failed":
				return "bg-red-100 text-red-800 hover:bg-red-200";
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-200";
		}
	};

	return (
		<Card className="w-full gap-0 max-w-[60%] shadow-lg border-0">
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-lg font-medium flex items-center gap-2">
					<FileText className="h-5 w-5" />
					Submission Log
				</CardTitle>
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="h-8 w-8 rounded-full"
				>
					<X className="h-4 w-4" />
				</Button>
			</CardHeader>
			<CardContent className="p-4 relative">
				<ScrollArea className="h-80 rounded-md border">
					{logs.length > 0 ? (
						<ul className="space-y-2 p-4">
							{logs.map((log, i) => (
								<li key={i} className="flex items-start gap-2">
									{getLogIcon(log.type)}
									<div
										className={`text-sm px-3 py-2 rounded-md w-full ${
											log.type === "success"
												? "bg-green-50 text-green-700"
												: log.type === "error"
												? "bg-red-50 text-red-700"
												: "bg-gray-50 text-gray-700"
										}`}
									>
										<pre className="whitespace-pre-wrap font-mono text-xs overflow-x-auto">
											{log.message}
										</pre>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="h-full flex items-center justify-center text-gray-400 p-4">
							No logs available
						</div>
					)}
				</ScrollArea>
			</CardContent>
			<CardFooter className="pt-0 flex justify-between items-center">
				<Badge
					variant="outline"
					className={`flex items-center gap-1 px-3 py-1 ${getStatusColor()}`}
				>
					{getStatusIcon()}
					<span className="font-semibold">{status.toUpperCase()}</span>
				</Badge>
			</CardFooter>
		</Card>
	);
}
