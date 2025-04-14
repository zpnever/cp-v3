"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadImage(formData: FormData) {
	const file = formData.get("file") as File;

	if (!file) {
		return { error: "No file uploaded." };
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

	try {
		const result = await cloudinary.uploader.upload(base64Image, {
			folder: "cp_assets",
		});

		return { imageUrl: result.secure_url };
	} catch (err) {
		return { error: "Upload failed.", err };
	}
}
