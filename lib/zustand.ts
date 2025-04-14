import { create } from "zustand";

interface ImageStore {
	uploadedUrl: string[];
	addUrl: (url: string) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
	uploadedUrl: [],
	addUrl: (url) =>
		set((state) => ({ uploadedUrl: [...state.uploadedUrl, url] })),
}));
