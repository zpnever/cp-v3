"use client";

import { Editor } from "@monaco-editor/react";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { saveDraft } from "@/utils/saveDrafts";
import { useRouter } from "next/navigation";
import { Problem } from "@/lib/types";
import toast from "react-hot-toast";

export interface EditorLayerHandle {
	getCode: () => string | undefined;
}

const languages = [
	{ name: "javascript", id: "15" },
	{ name: "python", id: "19" },
	{ name: "ruby", id: "22" },
	{ name: "cpp", id: "11" },
	{ name: "c", id: "6" },
	{ name: "java", id: "14" },
	{ name: "rust", id: "23" },
];

interface EditorLayerProps {
	draftCode: Record<number, string>;
	languageId: string;
	userId: string;
	problemId: string;
	submissionCode?: string | undefined | null;
}

const EditorLayer = forwardRef<EditorLayerHandle, EditorLayerProps>(
	(
		{ draftCode, languageId, submissionCode = undefined, userId, problemId },
		ref
	) => {
		const [language, setLanguage] = useState<string | undefined>();
		const [code, setCode] = useState<string>("");

		useEffect(() => {
			const getCodeTemplate = draftCode[Number(languageId)];

			if (getCodeTemplate === undefined) {
				toast.error("Can't get code template");
				return;
			}

			setCode(getCodeTemplate);
			setLanguage(languages.find((lang) => lang.id === languageId)?.name);
		}, [languageId, draftCode, submissionCode]);

		useImperativeHandle(ref, () => ({
			getCode: () => code,
		}));

		return (
			<div className="pt-4 h-full relative bg-[rgb(30,30,30)]">
				<Editor
					value={code}
					theme="vs-dark"
					language={language}
					height="90%"
					onChange={(value) => {
						setCode(value ?? "");
					}}
				/>
			</div>
		);
	}
);

EditorLayer.displayName = "EditorLayer";
export default EditorLayer;
