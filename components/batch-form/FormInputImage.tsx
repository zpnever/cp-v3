"use client";

import { useState, useTransition } from "react";
import { uploadImage } from "@/actions/imageUpload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import toast from "react-hot-toast";
import { useImageStore } from "@/lib/zustand"; // Import Zustand store

export default function FormInputImage({ onClose }: { onClose: () => void }) {
	const [image, setImage] = useState<File | null>(null);
	const uploadedUrl = useImageStore((state) => state.uploadedUrl);
	const addUrl = useImageStore((state) => state.addUrl);
	const [isPending, startTransition] = useTransition();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
		}
	};

	const handleUpload = async () => {
		startTransition(async () => {
			if (!image) return;

			const formData = new FormData();
			formData.append("file", image);

			const result = await uploadImage(formData);

			if (result.error) {
				toast.error(result.error, { removeDelay: 2000 });
			} else {
				if (result.imageUrl) {
					addUrl(result.imageUrl); // Simpan URL ke Zustand agar tetap ada meskipun komponen di-close
				}
				toast.success("Image successfully uploaded", { removeDelay: 2000 });
			}
		});
	};

	return (
		<Card>
			<CardHeader className="flex justify-between">
				<div className="flex flex-col gap-2">
					<CardTitle>
						<div>Upload Images</div>
					</CardTitle>
					<CardDescription>Upload your images here</CardDescription>
				</div>
				<Button
					onClick={onClose}
					disabled={isPending}
					className="cursor-pointer w-8 h-8"
				>
					<X />
				</Button>
			</CardHeader>
			<CardContent>
				<Input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="mb-4"
				/>
				<Button onClick={handleUpload} disabled={isPending}>
					Upload
				</Button>
			</CardContent>
			<CardContent className="flex flex-col justify-start">
				<div>List of URLs you can use:</div>
				<div className="mx-4">
					<ul className="list-disc">
						{uploadedUrl.map((url, index) => (
							<li key={index}>{url}</li>
						))}
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
